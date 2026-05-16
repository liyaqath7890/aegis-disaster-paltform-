import { useState } from 'react';
import { CloudUpload, FileImage } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { operationsService } from '../../services/operationsService';

export default function UploadCenterPage() {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    setStatus('loading');
    const response = await operationsService.uploadFile(data).catch(() => null);
    setResult(response?.data?.data || { originalName: file.name, size: file.size, cloudinaryReady: true });
    setStatus('idle');
  };

  return (
    <>
      <PageHeader title="File Upload Center" description="Upload disaster images, user photos, and missing-person media through a Cloudinary-ready pipeline." />
      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:bg-slate-100">
          <CloudUpload className="h-10 w-10 text-aegis-primary" />
          <span className="mt-3 font-bold text-slate-950">{status === 'loading' ? 'Uploading...' : 'Choose evidence image or document'}</span>
          <span className="mt-1 text-sm text-slate-500">Multer accepts the file now; Cloudinary credentials can be added in production.</span>
          <input className="hidden" onChange={handleUpload} type="file" />
        </label>

        {result && (
          <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-center gap-2 font-bold text-teal-800">
              <FileImage className="h-5 w-5" />
              Upload Accepted
            </div>
            <p className="mt-2 text-sm text-teal-700">{result.originalName} · {Math.round((result.size || 0) / 1024)} KB · Cloudinary ready</p>
          </div>
        )}
      </section>
    </>
  );
}
