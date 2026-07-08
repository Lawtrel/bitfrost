import ProgressBar from "@/components/ui/progressBar/ProgressBar";
import { useMediaLoading } from "@/hooks/mediaLoading/useMediaLoading";

export default function ApresentationHero (){
    const {
            progress,
            isLoading,
            completeLoading,
        } = useMediaLoading();
    return (
        <div className='w-[1000px] relative'>
            {isLoading && (
                <ProgressBar
                    progress={progress}
                    className="absolute top-[50%] left-[12%] w-[80%]"
                />
                )}
            <img loading='lazy' onLoad={completeLoading} className={`w-[1000px] h-auto border-indigo-600 border-2 ${isLoading ? 'blur-xl scale-105 opacity-60': 'blur-0 scale-100 opacity-100'} `} src="/assets/Foto Interna Projeto.png" alt="Imagem representado o projeto" />
        </div>
    )
}