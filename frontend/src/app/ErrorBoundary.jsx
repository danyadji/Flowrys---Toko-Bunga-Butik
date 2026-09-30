import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto max-w-container px-4 py-16 text-center">
          <h1 className="text-2xl">Ada yang tidak beres</h1>
          <p className="mt-2 text-ink-muted">
            Coba muat ulang halaman. Jika masih gagal, kembali lagi nanti.
          </p>
          <button
            type="button"
            className="btn-primary mt-6"
            onClick={() => window.location.reload()}
          >
            Muat ulang
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
