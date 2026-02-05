import Image from "next/image";

export default function Home() {
  return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
        <main className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Hello World!
          </h1>
          <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
            This was made by Nabiha :)
          </p>
        </main>
      </div>
  );
}
