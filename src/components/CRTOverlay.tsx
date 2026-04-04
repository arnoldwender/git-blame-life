export default function CRTOverlay() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(204,68,255,0.012) 2px, rgba(204,68,255,0.012) 4px)',
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      <div
        className="fixed left-0 right-0 h-[2px] pointer-events-none z-[9997] animate-scandown"
        style={{ background: 'rgba(204,68,255,0.06)' }}
      />
    </>
  );
}
