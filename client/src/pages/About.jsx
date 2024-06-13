

function About() {
    return (
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 box-border mb-4">
            <div className="flex justify-center items-center">
                <h1 className="text-2xl">DevBlog</h1>
            </div>
            <div className="flex flex-col text-left indent-2 text-lg gap-y-2 m-5">
                <h2>
                    Olá. Este é o meu primeiro projeto web full stack. Eu criei o front-end em React e o back-end em Node com PostgreSQL como banco de dados, e levei cerca de dois meses para concluí-lo.
                </h2>    
                <h2>
                    Como este é um site de ecommerce, ele precisava ter um sistema de registro e login. Nunca trabalhei com login antes, então assisti este tutorial sobre a stack PERN no canal do youtube &apos;The Stoic Programmers&apos; que aborda justamente esse tema.
                </h2>
                <div className="flex items-center justify-center aspect-video">
                    <iframe className="w-full h-full" src="https://www.youtube.com/embed/7UQBMb8ZpuE" title="Learn JWT with the PERN stack by building a Registration/Login system Part 1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>                    
                </div>
                <h2>
                    O vídeo acima me ensinou o funcionamento básico da stack PERN, token JWT, como configurar um banco de dados PostgreSQL, etc. Mas para todo o resto, eu estava por minha conta.
                </h2> 
                <h2>
                    Em resumo, o projeto é uma aplicação simples, com APIs que realizarão operações CRUD quando suas rotas forem acionadas por solicitações HTTP, e a resposta será exibida na interface do usuário. Tanto o banco Postgres quanto o app Node estão hosteados no Render, enquanto o app Front-end React está hosteado no Vercel. 
                </h2>
            </div>
        </div>
    )
}

export default About

