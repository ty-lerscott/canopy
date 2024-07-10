import { Figtree } from "next/font/google";
const figtree = Figtree({
	subsets: ["latin"],
	weight: ["400", "600", "700", "800"],
});

export default function Home() {
	return (
		<div
			className={`h-screen w-screen bg-no-repeat bg-center bg-cover text-green-50 ${figtree.className}`}
			style={{
				backgroundImage: "url(/images/family.jpg)",
			}}
		>
			<main className="container mx-auto h-full flex flex-col justify-center items-center">
				<div className="bg-green-800/80 rounded outline outline-4 outline-green-500 p-4 text-center">
					<h1 className="text-5xl font-bold">
						I’m Tyler Scott and I code stuff.
					</h1>
					<p className="my-4">
						This is just a landing page for the api layer for applications I am
						going to be building.
					</p>
					<div className="inline-flex">
						<a
							className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded"
							href="https://ty.lerscott.com"
						>
							Main Site
						</a>
					</div>
				</div>
			</main>
		</div>
	);
}
