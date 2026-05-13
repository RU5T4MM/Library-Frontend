// PhonePe QR Code - MUHAMAD RUSTAM
// To update: replace the src with your actual QR image base64 or URL
const QRCode = () => (
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-200 w-48 mx-auto flex items-center justify-center overflow-hidden">
        {/* QR Image - tries public folder first */}
        <img
            src="/qr-code.png"
            alt="PhonePe QR - MUHAMAD RUSTAM"
            className="w-full h-auto object-contain rounded-xl"
            onError={(e) => {
                // Fallback: show a styled placeholder with instructions
                e.target.replaceWith((() => {
                    const div = document.createElement('div');
                    div.className = 'w-full aspect-[1/2] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center gap-1 bg-slate-50 p-2';
                    div.innerHTML = '<span style="font-size:2rem">📱</span><span style="font-size:11px;color:#64748b;text-align:center;padding:0 4px">Save your QR image as<br/><b>qr-code.png</b><br/>in the /public folder</span>';
                    return div;
                })());
            }}
        />
    </div>
);

export default QRCode;
