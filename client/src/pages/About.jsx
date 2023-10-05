

function About() {
    return (
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 box-border">
            <div className="flex justify-center items-center">
                <h1 className="text-2xl">DevBlog</h1>
            </div>
            <div className="flex flex-col text-left indent-2 text-lg gap-y-2 m-4">
                <h2>
                    Hello. This is my first full stack web project. I made the front-end on React, and the back-end on Node with PostgreSQL as the database, and it took me some two months to complete it. Let&apos;s start with the back-end. 
                </h2>    
                <h2>
                    Since this is an ecommerce website, it needed to have a register and login system. I&apos;ve never handled login before, so I watched this video tutorial on the PERN stack by &apos;The Stoic Programmers&apos;
                </h2>
                <div className="flex items-center justify-center aspect-video">
                    <iframe className="w-full h-full" src="https://www.youtube.com/embed/7UQBMb8ZpuE" title="Learn JWT with the PERN stack by building a Registration/Login system Part 1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>                    
                </div>
                <h2>
                    The video above taught me the basic workings of the PERN stack, JWT token, how to set up a PostgreSQL database, etc. But the teachings in the video was basically the basis of the stack and how they implement each other aside from the basic stuff, I was on my own.
                </h2> 
                <h2>
                    The difficult part wasn&apos;t creating the API in the server side though, it was how to consume it on the front-end. Even if you create a local state in your components to store the data of your GET requests, it can only be accessed inside that specific component. What if you wanted to share it across your entire application? To solve this, I decided to use the useContext hook React provides by creating a separate file to store all global states so that every component can use them.
                </h2>
                <h2>
                    There&apos;s so much I could talk about here, but I&apos;ll keep it short.
                </h2>
            </div>
            
        </div>
    )
}

export default About