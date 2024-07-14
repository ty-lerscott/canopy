import { cn } from "@/api/utils";

const Template = ({
	image,
	title,
	subtitle,
}: { image?: string; title?: string; subtitle?: string }) => {
	const imageSrc = `data:image/png;base64,${image}`;
	const cleanedTitle = decodeURIComponent(title || "");
	const cleanedSubtitle = decodeURIComponent(subtitle || "");

	return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Blur Image</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
        			* {
        				line-height: 1;
        			}
                	.Body {
                		background-image: url(${imageSrc});        		
                	}
                	.Title {
                		font-size: 6rem;
                		font-weight: 600;
                	}
                	.Subtitle {
                		font-size: 2.5rem;
                		font-weight: 400;
                		color: #c8c8c8;
                	}
				</style>
            </head>
            <body>
            	<div class="Body bg-no-repeat bg-center bg-cover relative">
            		<div class="flex flex-col justify-center items-center absolute top-0 left-0 right-0 bottom-0 p-8">
						<h1 class="Title text-white text-center mb-4 ${cn(cleanedTitle ? "block" : "hidden")}">${cleanedTitle}</h1>
						<p class="Subtitle text-center ${cn(cleanedSubtitle ? "block" : "hidden")}">${cleanedSubtitle}</p>
					</div>
                	<img class="opacity-0 h-full w-full" src="${imageSrc}" alt="og image" />
                </div>
            </body>
        </html>`;
};

export default Template;
