import React, { useState } from 'react';

interface FretPosition {
  string: number;
  fret: number;
  note?: string;
  color?: string;
}

interface FretboardComponentProps {
  highlightedNotes?: FretPosition[];
  showNotes?: boolean;
  frets?: number;
}

const FretboardComponent: React.FC<FretboardComponentProps> = ({ 
  highlightedNotes = [], 
  showNotes = false, 
  frets = 12 
}) => {
  const [hoveredFret, setHoveredFret] = useState<{string: number, fret: number} | null>(null);

  const stringNotes = [
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E'],
    ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G'],
    ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D'],
    ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A'],
    ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E']
  ];

  const getHighlightedNote = (stringIndex: number, fretIndex: number) => {
    return highlightedNotes.find(note => note.string === stringIndex && note.fret === fretIndex);
  };

  const getNoteAtPosition = (stringIndex: number, fretIndex: number) => {
    return stringNotes[stringIndex][fretIndex];
  };

  return (
    <div className="fretboard-container">
      <div className="fretboard">
        <div className="fret-numbers">
          <div className="fret-number"></div>
          {Array.from({ length: frets }, (_, i) => (
            <div key={i + 1} className="fret-number">{i + 1}</div>
          ))}
        </div>

        <div className="strings-container">
          {stringNotes.map((stringNote, stringIndex) => (
            <div key={stringIndex} className="guitar-string">
              <div className={`string-line string-${stringIndex}`}></div>
              
              {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                const highlighted = getHighlightedNote(stringIndex, fretIndex);
                const note = getNoteAtPosition(stringIndex, fretIndex);
                const isHovered = hoveredFret?.string === stringIndex && hoveredFret?.fret === fretIndex;
                
                return (
                  <div
                    key={fretIndex}
                    className={`fret-position ${fretIndex === 0 ? 'nut' : ''}`}
                    onMouseEnter={() => setHoveredFret({ string: stringIndex, fret: fretIndex })}
                    onMouseLeave={() => setHoveredFret(null)}
                  >
                    {(highlighted || isHovered) && (
                      <div 
                        className={`note-dot ${highlighted ? 'highlighted' : ''}`}
                        style={{ 
                          backgroundColor: highlighted?.color || 'var(--secondary-color)',
                          opacity: highlighted ? 1 : 0.7
                        }}
                      >
                        <span className="note-text">
                          {highlighted?.note || note}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Fretboard: React.FC = () => {
  const [selectedScale, setSelectedScale] = useState<'none' | 'cmajor'>('none');

  const scales = {
    none: [],
    cmajor: [

      { string: 5, fret: 0, note: 'E', color: 'var(--secondary-color)' },
      { string: 5, fret: 1, note: 'F', color: 'var(--secondary-color)' },
      { string: 5, fret: 3, note: 'G', color: 'var(--secondary-color)' },
      { string: 5, fret: 5, note: 'A', color: 'var(--secondary-color)' },
      { string: 5, fret: 7, note: 'B', color: 'var(--secondary-color)' }, 
      { string: 5, fret: 8, note: 'C', color: 'var(--accent-color)' },
      { string: 5, fret: 10, note: 'D', color: 'var(--secondary-color)' },
      { string: 5, fret: 12, note: 'E', color: 'var(--secondary-color)' },
     
      { string: 4, fret: 0, note: 'A', color: 'var(--secondary-color)' },
      { string: 4, fret: 2, note: 'B', color: 'var(--secondary-color)' },
      { string: 4, fret: 3, note: 'C', color: 'var(--accent-color)' },
      { string: 4, fret: 5, note: 'D', color: 'var(--secondary-color)' },
      { string: 4, fret: 7, note: 'E', color: 'var(--secondary-color)' },
      { string: 4, fret: 9, note: 'F', color: 'var(--secondary-color)' },
      { string: 4, fret: 10, note: 'G', color: 'var(--secondary-color)' },
      { string: 4, fret: 12, note: 'A', color: 'var(--secondary-color)' },

      { string: 3, fret: 0, note: 'D', color: 'var(--secondary-color)' },
      { string: 3, fret: 2, note: 'E', color: 'var(--secondary-color)' },
      { string: 3, fret: 4, note: 'F', color: 'var(--secondary-color)' },
      { string: 3, fret: 5, note: 'G', color: 'var(--secondary-color)' },
      { string: 3, fret: 7, note: 'A', color: 'var(--secondary-color)' },
      { string: 3, fret: 9, note: 'B', color: 'var(--secondary-color)' },
      { string: 3, fret: 10, note: 'C', color: 'var(--accent-color)' },
      { string: 3, fret: 12, note: 'D', color: 'var(--secondary-color)' },

      { string: 2, fret: 0, note: 'G', color: 'var(--secondary-color)' },
      { string: 2, fret: 2, note: 'A', color: 'var(--secondary-color)' },
      { string: 2, fret: 4, note: 'B', color: 'var(--secondary-color)' },
      { string: 2, fret: 5, note: 'C', color: 'var(--accent-color)' },
      { string: 2, fret: 7, note: 'D', color: 'var(--secondary-color)' },
      { string: 2, fret: 9, note: 'E', color: 'var(--secondary-color)' },
      { string: 2, fret: 10, note: 'F', color: 'var(--secondary-color)' },
      { string: 2, fret: 12, note: 'G', color: 'var(--secondary-color)' },

      { string: 1, fret: 0, note: 'B', color: 'var(--secondary-color)' },
      { string: 1, fret: 1, note: 'C', color: 'var(--accent-color)' },
      { string: 1, fret: 3, note: 'D', color: 'var(--secondary-color)' },
      { string: 1, fret: 5, note: 'E', color: 'var(--secondary-color)' },
      { string: 1, fret: 6, note: 'F', color: 'var(--secondary-color)' },
      { string: 1, fret: 8, note: 'G', color: 'var(--secondary-color)' },
      { string: 1, fret: 10, note: 'A', color: 'var(--secondary-color)' },
      { string: 1, fret: 12, note: 'B', color: 'var(--secondary-color)' },

      { string: 0, fret: 0, note: 'E', color: 'var(--secondary-color)' },
      { string: 0, fret: 1, note: 'F', color: 'var(--secondary-color)' },
      { string: 0, fret: 3, note: 'G', color: 'var(--secondary-color)' }, 
      { string: 0, fret: 5, note: 'A', color: 'var(--secondary-color)' },
      { string: 0, fret: 7, note: 'B', color: 'var(--secondary-color)' },
      { string: 0, fret: 8, note: 'C', color: 'var(--accent-color)' },
      { string: 0, fret: 10, note: 'D', color: 'var(--secondary-color)' },
      { string: 0, fret: 12, note: 'E', color: 'var(--secondary-color)' },

    ],
  
  };

  return (
    <div className="page">
      <h1 className="page-title">Fretboard</h1>      
      <h2 className='text-secondary'>Interactive Guitar Fretboard</h2>
      <p className='text-accent'>Explore scales and chords on the fretboard. Hover over frets to see note names!</p>
      
      {/* Controls */}
      <div className="controls">
        <button 
          className={`control-button ${selectedScale === 'none' ? 'active' : ''}`}
          onClick={() => setSelectedScale('none')}
        >
          Clear
        </button>
        <button 
          className={`control-button ${selectedScale === 'cmajor' ? 'active' : ''}`}
          onClick={() => setSelectedScale('cmajor')}
        >
          C Major Scale
        </button>
      </div>

      {/* The Fretboard Component */}
      <FretboardComponent 
        highlightedNotes={scales[selectedScale]}
        frets={12}
      />
    </div>
  );
};

export default Fretboard;