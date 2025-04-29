import Navbar from '../../components/Navbar';

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
