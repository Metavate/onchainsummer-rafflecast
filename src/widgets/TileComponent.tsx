import Link from 'next/link';

interface TileProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string; // Optional background color
}

const TileComponent: React.FC<TileProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  backgroundColor = 'white', // Default background color
}) => {
  return (
    <div className={`tile w-full bg-${backgroundColor} text-black p-20 gap-8 flex flex-col text-center`}>
      <h2 className="text-6xl">{title}</h2>
      <p className="text-3xl">{description}</p>
      <Link href={buttonLink}>
        <p className="button text-3xl p-8 bg-[--RaffleCast-ActiveColor] text-white rounded-xl">{buttonText}</p>
      </Link>
    </div>
  );
};

export default TileComponent;
