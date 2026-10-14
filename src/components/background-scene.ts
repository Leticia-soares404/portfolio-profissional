import {
    Color,
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    Scene,
    ShaderMaterial,
    Vector2,
    Vector4,
    WebGLRenderer,
} from 'three'

export type BackgroundPalette = {
    base: string
    primary: string
    secondary: string
    intensity: number
}

export type BackgroundHandle = {
    setPalette: (palette: BackgroundPalette) => void
    destroy: () => void
}

const MAX_RIPPLES = 6
const RIPPLE_LIFETIME = 3

const vertexShader = /* glsl */ `
    void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`

/*
 * Tinta escorrendo em água: fbm com domain warping dá o fluxo lento; o mouse
 * empurra o domínio para fora do ponteiro (a "onda" que segue o cursor) e cada
 * clique abre um anel que se propaga e morre em RIPPLE_LIFETIME segundos.
 */
const fragmentShader = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uMouseForce;
    uniform vec3 uBase;
    uniform vec3 uPrimary;
    uniform vec3 uSecondary;
    uniform float uIntensity;
    uniform vec4 uRipples[${MAX_RIPPLES}];

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
        );
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = p * 2.03 + vec2(1.7, 9.2);
            a *= 0.5;
        }
        return v;
    }

    void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 uv = gl_FragCoord.xy / uResolution;
        vec2 p = vec2(uv.x * aspect, uv.y);

        vec2 m = vec2(uMouse.x * aspect, uMouse.y);
        float d = distance(p, m);
        vec2 away = normalize(p - m + 1e-4);
        p -= away * exp(-d * d * 14.0) * uMouseForce * 0.09;

        float ring = 0.0;
        for (int i = 0; i < ${MAX_RIPPLES}; i++) {
            vec4 r = uRipples[i];
            float age = uTime - r.z;
            if (r.w > 0.5 && age >= 0.0 && age < ${RIPPLE_LIFETIME.toFixed(1)}) {
                vec2 rp = vec2(r.x * aspect, r.y);
                float dist = distance(p, rp);
                float front = dist - age * 0.38;
                float fade = 1.0 - age / ${RIPPLE_LIFETIME.toFixed(1)};
                float wave = sin(front * 42.0) * exp(-abs(front) * 12.0) * fade;
                p += normalize(p - rp + 1e-4) * wave * 0.014;
                ring += wave * fade;
            }
        }

        float t = uTime * 0.035;
        vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(5.2, 1.3) - t));
        vec2 w = vec2(
            fbm(p * 1.5 + 4.0 * q + vec2(1.7, 9.2) + t * 1.4),
            fbm(p * 1.5 + 4.0 * q + vec2(8.3, 2.8) - t)
        );
        float f = fbm(p * 1.5 + 4.0 * w);

        vec3 col = uBase;
        col = mix(col, uPrimary, clamp(f * f * 1.15, 0.0, 1.0) * uIntensity);
        col = mix(col, uSecondary, clamp(length(q) * 0.7 - 0.25, 0.0, 1.0) * uIntensity * 0.85);
        col += uPrimary * exp(-d * d * 28.0) * 0.16 * uIntensity;
        col += uPrimary * max(ring, 0.0) * 0.12;

        col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.018;

        gl_FragColor = vec4(col, 1.0);
    }
`

export function createBackgroundScene(
    container: HTMLElement,
    palette: BackgroundPalette,
    reducedMotion: boolean,
): BackgroundHandle {
    const renderer = new WebGLRenderer({ antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    container.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const start = performance.now()

    const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new Vector2(1, 1) },
        uMouse: { value: new Vector2(0.7, 0.6) },
        uMouseForce: { value: 0.3 },
        uBase: { value: new Color() },
        uPrimary: { value: new Color() },
        uSecondary: { value: new Color() },
        uIntensity: { value: 0.5 },
        uRipples: { value: Array.from({ length: MAX_RIPPLES }, () => new Vector4()) },
    }

    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    const geometry = new PlaneGeometry(2, 2)
    scene.add(new Mesh(geometry, material))

    const target = new Vector2(0.7, 0.6)
    let velocity = 0
    let nextRipple = 0
    let frame = 0

    function setPalette(next: BackgroundPalette): void {
        uniforms.uBase.value.set(next.base)
        uniforms.uPrimary.value.set(next.primary)
        uniforms.uSecondary.value.set(next.secondary)
        uniforms.uIntensity.value = next.intensity
        if (reducedMotion) render()
    }

    function resize(): void {
        const { clientWidth: w, clientHeight: h } = container
        renderer.setSize(w, h, false)
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        renderer.getDrawingBufferSize(uniforms.uResolution.value)
        if (reducedMotion) render()
    }

    function toUv(event: PointerEvent): Vector2 {
        return new Vector2(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight)
    }

    function onMove(event: PointerEvent): void {
        const uv = toUv(event)
        velocity = Math.min(1, velocity + uv.distanceTo(target) * 6)
        target.copy(uv)
    }

    /* Clique em botão ou link é navegação, não brincadeira com a água. */
    function onDown(event: PointerEvent): void {
        if ((event.target as HTMLElement).closest('a, button, input, textarea, label, [data-cursor]')) {
            return
        }

        const uv = toUv(event)
        uniforms.uRipples.value[nextRipple].set(uv.x, uv.y, uniforms.uTime.value, 1)
        nextRipple = (nextRipple + 1) % MAX_RIPPLES
    }

    function render(): void {
        renderer.render(scene, camera)
    }

    function tick(): void {
        frame = requestAnimationFrame(tick)

        if (document.hidden) {
            return
        }

        uniforms.uTime.value = (performance.now() - start) / 1000
        uniforms.uMouse.value.lerp(target, 0.06)
        velocity *= 0.95
        uniforms.uMouseForce.value = 0.3 + velocity * 1.4
        render()
    }

    setPalette(palette)
    resize()

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    if (reducedMotion) {
        render()
    } else {
        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerdown', onDown, { passive: true })
        tick()
    }

    return {
        setPalette,
        destroy() {
            cancelAnimationFrame(frame)
            observer.disconnect()
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerdown', onDown)
            geometry.dispose()
            material.dispose()
            renderer.dispose()
            renderer.domElement.remove()
        },
    }
}
