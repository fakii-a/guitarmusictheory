import React, { useState, useEffect } from "react";
import { Note, Interval, Scale } from "tonal";

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

interface ScaleData {
  name: string;
  notes: string[];
  intervals: string[];
}

class MusicTheoryService {
  static getScale(rootNote: string, scaleType: string): ScaleData {
    const scale = Scale.get(`${rootNote} ${scaleType}`);
    return {
      name: scale.name,
      notes: scale.notes,
      intervals: scale.intervals,
    };
  }

  static getAllScaleTypes(): string[] {
    return [
      "major",
      "minor",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "aeolian",
      "locrian",
      "harmonic minor",
      "melodic minor",
      "pentatonic",
      "minor pentatonic",
      "blues",
    ];
  }
}

const openStrings = ["E2", "A2", "D3", "G3", "B3", "E4"];

function generateStringNotes(openNote: string, frets: number): string[] {
  return Array.from({ length: frets + 1 }, (_, i) =>
    Note.transpose(openNote, Interval.fromSemitones(i))
  ).map((n) => Note.get(n).pc);
}

function generateAllStrings(frets: number): string[][] {
  return openStrings.map((s) => generateStringNotes(s, frets));
}

const FretboardComponent: React.FC<FretboardComponentProps> = ({
  highlightedNotes = [],
  showNotes = false,
  frets = 12,
}) => {
  const [hoveredFret, setHoveredFret] = useState<{
    string: number;
    fret: number;
  } | null>(null);

  const stringNotes = generateAllStrings(frets);

  const getHighlightedNote = (stringIndex: number, fretIndex: number) => {
    return highlightedNotes.find(
      (note) => note.string === stringIndex && note.fret === fretIndex
    );
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
            <div key={i + 1} className="fret-number">
              {i + 1}
            </div>
          ))}
        </div>

        <div className="strings-container">
          {stringNotes.map((stringNote, stringIndex) => (
            <div key={stringIndex} className="guitar-string">
              <div className={`string-line string-${stringIndex}`}></div>

              {Array.from({ length: frets + 1 }, (_, fretIndex) => {
                const highlighted = getHighlightedNote(stringIndex, fretIndex);
                const note = getNoteAtPosition(stringIndex, fretIndex);
                const isHovered =
                  hoveredFret?.string === stringIndex &&
                  hoveredFret?.fret === fretIndex;

                return (
                  <div
                    key={fretIndex}
                    className={`fret-position ${fretIndex === 0 ? "nut" : ""}`}
                    onMouseEnter={() =>
                      setHoveredFret({ string: stringIndex, fret: fretIndex })
                    }
                    onMouseLeave={() => setHoveredFret(null)}
                  >
                    {(highlighted || isHovered) && (
                      <div
                        className={`note-dot ${
                          highlighted ? "highlighted" : ""
                        }`}
                        style={{
                          backgroundColor:
                            highlighted?.color || "var(--secondary-color)",
                          opacity: highlighted ? 1 : 0.7,
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

const getEnharmonicSet = (notes: string[]): Set<string> => {
  const enharmonicSet = new Set<string>();
  notes.forEach((note) => {
    const noteObj = Note.get(note);
    if (noteObj.empty) return;
    

    enharmonicSet.add(noteObj.pc);
    

    const enharmonic = Note.enharmonic(noteObj.pc);
    if (enharmonic) {
      enharmonicSet.add(enharmonic);
    }
  });
  return enharmonicSet;
};

const convertNotesToAccidental = (notes: string[], preference: 'sharps' | 'flats' | 'default'): string[] => {
  if (preference === 'default') {
    return notes;
  }

  return notes.map(note => {
    const noteObj = Note.get(note);
    if (noteObj.empty) return note;
    
    if (preference === 'sharps') {

      return Note.simplify(noteObj.pc);
    } else {

      const withFlats = noteObj.pc
        .replace('C#', 'Db')
        .replace('D#', 'Eb')
        .replace('F#', 'Gb')
        .replace('G#', 'Ab')
        .replace('A#', 'Bb');
      

      if (withFlats === 'E#') return 'F';
      if (withFlats === 'B#') return 'C';
      if (withFlats === 'Cb') return 'B';
      if (withFlats === 'Fb') return 'E';
      
      return withFlats;
    }
  });
};

const Fretboard: React.FC = () => {
  const [selectedScale, setSelectedScale] = useState<string>("none");
  const [selectedRoot, setSelectedRoot] = useState<string>("C");
  const [highlightedNotes, setHighlightedNotes] = useState<FretPosition[]>([]);
  const [availableScales, setAvailableScales] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [accidentalPreference, setAccidentalPreference] = useState<'sharps' | 'flats' | 'default'>('default');

  const rootNotes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  useEffect(() => {
    setAvailableScales(MusicTheoryService.getAllScaleTypes());
  }, []);

  useEffect(() => {
    if (selectedScale === "none") {
      setHighlightedNotes([]);
      return;
    }

    setLoading(true);

    try {
      const scaleData = MusicTheoryService.getScale(selectedRoot, selectedScale);
      
      const convertedNotes = convertNotesToAccidental(scaleData.notes, accidentalPreference);
      
      const positions = generateFretboardPositions(
        convertedNotes,
        selectedRoot,
        12
      );
      setHighlightedNotes(positions);
    } catch (error) {
      console.error("Error loading scale:", error);
      setHighlightedNotes([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRoot, selectedScale, accidentalPreference]);


  const generateFretboardPositions = (
    scaleNotes: string[],
    root: string,
    frets: number
  ): FretPosition[] => {
    const positions: FretPosition[] = [];
    const stringNotes = generateAllStrings(frets);

    const normalizedScaleNotes = getEnharmonicSet(scaleNotes);
    const normalizedRoot = Note.get(root).pc;

    stringNotes.forEach((string, stringIndex) => {
      string.forEach((note, fretIndex) => {
        const normalizedFretNote = Note.get(note).pc;

        if (normalizedScaleNotes.has(normalizedFretNote)) {
          const isRoot = normalizedFretNote === normalizedRoot;

          let displayedNote = scaleNotes.find(sn => {
            const snPc = Note.get(sn).pc;
            return snPc === normalizedFretNote || 
                   Note.enharmonic(snPc) === normalizedFretNote;
          }) || note;

          positions.push({
            string: stringIndex,
            fret: fretIndex,
            note: displayedNote,
            color: isRoot ? "var(--accent-color)" : "var(--secondary-color)",
          });
        }
      });
    });

    return positions;
  };

  const handleScaleChange = (scaleType: string) => {
    setSelectedScale(scaleType);
  };

  const handleRootChange = (root: string) => {
    setSelectedRoot(root);
  };

  const handleAccidentalChange = (preference: 'sharps' | 'flats' | 'default') => {
    setAccidentalPreference(preference);
  };

  return (
    <div>
      <div className="page">
        <h1 className="page-title">Interactive Guitar Fretboard</h1>
        <h2 className="text-secondary">Learn Scales & Theory</h2>
        <p className="text-accent">{loading && " - Loading..."}</p>

        <div className="controls">
          <div className="control-group">
            <select
              id="root-select"
              value={selectedRoot}
              onChange={(e) => handleRootChange(e.target.value)}
              className="control-select"
            >
              {rootNotes.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <select
              id="scale-select"
              value={selectedScale}
              onChange={(e) => handleScaleChange(e.target.value)}
              className="control-select"
              disabled={loading}
            >
              <option value="none">Select Scale</option>
              {availableScales.map((scale) => (
                <option key={scale} value={scale}>
                  {scale.charAt(0).toUpperCase() + scale.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <select
              id="accidental-select"
              value={accidentalPreference}
              onChange={(e) => handleAccidentalChange(e.target.value as 'sharps' | 'flats' | 'default')}
              className="control-select"
            >
              <option value="default">Default</option>
              <option value="sharps">Show Sharps Only</option>
              <option value="flats">Show Flats Only</option>
            </select>
          </div>

          <div className="control-group">
            <button
              className={`clear-button ${
                selectedScale === "none" ? "active" : ""
              }`}
              onClick={() => handleScaleChange("none")}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <FretboardComponent highlightedNotes={highlightedNotes} frets={12} />
    </div>
  );
};

export default Fretboard;