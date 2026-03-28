import { useEffect, useState } from 'react';

type ApiStatus = {
  service: string;
  status: string;
  timestamp: string;
  dependencies: {
    redis: string;
    rabbitmq: string;
  };
};

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

export default function App() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStatus() {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Health check failed with ${response.status}`);
        }

        const data = (await response.json()) as ApiStatus;
        setStatus(data);
        setError(null);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unknown frontend-to-backend connectivity error',
        );
      }
    }

    void loadStatus();

    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">TalentSync</p>
        <h1>Frontend and backend now run as separate deployable apps.</h1>
        <p className="lede">
          This frontend is configured to call the NestJS API through
          <code> VITE_API_BASE_URL </code>
          while Redis and RabbitMQ stay colocated with the backend server.
        </p>
      </section>

      <section className="panel">
        <h2>Backend Connectivity</h2>
        <p className="meta">API base URL: {apiBaseUrl}</p>
        {status ? (
          <dl className="status-grid">
            <div>
              <dt>Service</dt>
              <dd>{status.service}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{status.status}</dd>
            </div>
            <div>
              <dt>Redis</dt>
              <dd>{status.dependencies.redis}</dd>
            </div>
            <div>
              <dt>RabbitMQ</dt>
              <dd>{status.dependencies.rabbitmq}</dd>
            </div>
            <div>
              <dt>Timestamp</dt>
              <dd>{new Date(status.timestamp).toLocaleString()}</dd>
            </div>
          </dl>
        ) : (
          <p className="empty">
            {error ?? 'Waiting for backend health response...'}
          </p>
        )}
      </section>
    </main>
  );
}
