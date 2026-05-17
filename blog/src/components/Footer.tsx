export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
