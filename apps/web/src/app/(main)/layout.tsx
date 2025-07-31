import DiscountBanner from "@/components/discount-banner";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <DiscountBanner />
            <Header />
            <main role="main">{children}</main>
            <Footer />
        </>
    );
}