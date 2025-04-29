import Navbar from '../../components/Navbar';

export default function IncomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <Navbar/>
      {children}
    </>
  );
}
