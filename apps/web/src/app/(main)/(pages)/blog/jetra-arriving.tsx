import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import Image from "next/image";
export default function JetraArriving() {
  return (
    <>
      <Breadcrumb />
      <section className="w-full py-8 md:py-12 lg:py-16">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl text-primary">
                Introducing Jetra
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A new category designed to enhance your experience
              </p>
            </div>
            <div className="w-full max-w-sm">
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                    <Image width={500}
                      height={500} src="/brand/jetra.png" alt="jetra brand" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-medium text-destructive">
                  Coming Soon
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  We&apos;re working on something special. Stay tuned for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
