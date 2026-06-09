import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  bg?: string;
}

export default function PhoneFrame({ children, bg }: PhoneFrameProps) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C3E50' }}>
      <div
        className="w-full max-w-[390px] min-h-screen sm:min-h-0 sm:h-[844px] sm:max-h-[92vh] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col"
        style={{ backgroundColor: bg || '#2D3E50' }}
      >
        {children}
      </div>
    </div>
  );
}
