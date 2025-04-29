import Navbar from '../../components/Navbar';

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
