import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'The Dramaturgy - Community for Dramaturgical Questions';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFEF8',
          position: 'relative',
        }}
      >
        {/* Red accent block */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 80,
            width: 200,
            height: 200,
            backgroundColor: '#C8372D',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: '#0A0A0A',
              letterSpacing: '-0.03em',
              lineHeight: 0.95,
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            The Dramaturgy
          </div>

          <div
            style={{
              fontSize: 36,
              color: '#6B6B6B',
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            Questions that Shape Performance
          </div>
        </div>

        {/* Bottom border */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#0A0A0A',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
