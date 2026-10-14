import { usePreferences } from '../lib/preferences'

export default function Footer() {
    const { copy } = usePreferences()

    return (
        <footer className="agua border-t border-borda pt-16 pb-9">
            <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                        <p className="font-display text-[26px] font-black">
                            letícia soares<span className="text-verde">.</span>
                        </p>
                        <p className="mt-2.5 max-w-[340px] font-grotesk text-sm leading-[1.7] text-suave">
                            {copy.footer.tagline}
                        </p>
                    </div>
                    <a href="#topo" className="link-sublinhado text-xs tracking-[0.12em] uppercase">
                        {copy.footer.backToTop}
                    </a>
                </div>
                <div className="mt-14 flex flex-wrap justify-between gap-3 border-t border-borda pt-6 text-[11px] tracking-[0.1em] text-suave uppercase">
                    <span>© {new Date().getFullYear()} letícia soares</span>
                    <span>{copy.footer.builtWith}</span>
                </div>
            </div>
        </footer>
    )
}
