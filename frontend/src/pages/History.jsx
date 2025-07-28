import React from 'react';

function History() {
  // This can later be connected to backend or global state
  const storedHistory = JSON.parse(localStorage.getItem('studysnap_history')) || [];

  return (
    <div className="card">
      <h2>📁 Transcript History</h2>
      {storedHistory.length === 0 ? (
        <p>No saved recordings yet.</p>
      ) : (
        storedHistory.map((item) => (
          <div key={item.id} className="history-item">
            <h4>📌 {item.label || 'Untitled'} — {new Date(item.id).toLocaleString()}</h4>
            <p><strong>Transcript:</strong> {item.transcript}</p>
            <p><strong>Summary:</strong> {item.summary}</p>
            <button
              onClick={() => {
                const doc = window.open('', '_blank');
                doc.document.write(`<pre>${item.transcript}</pre>`);
              }}
            >
              📄 Open Transcript
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
