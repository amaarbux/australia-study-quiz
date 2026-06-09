import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#2C3E50' }}>
      <div className="w-full max-w-[390px] min-h-screen sm:min-h-0 sm:h-[844px] sm:max-h-[92vh] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col cursor-pointer"
        onClick={() => router.push('/quiz/0')}
      >
        <img
          src="/images/title/title.png"
          alt="Australia Study Quiz"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
