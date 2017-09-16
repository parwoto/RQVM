import { Injectable } from '@angular/core';

@Injectable()
export class QualitiesLoaderService {

    /* ----------------------------------------------------------------------------------
                         Academic Information System (AIS) data
       ---------------------------------------------------------------------------------- */

    /* -------- Section 3.1 (Quality data, Subarea label, Total number of error) -------- */
    public AISSection3: Array<any> = [
        { data: [1.0, 1.0, 1.0, 0.5, 0.5, 1.0], label: 'Unambiguity' },
        { data: [1.0, 0.5, 1.0, 1.0, 1.0, 0.5], label: 'Completeness' },
        { data: [0.0, 1.0, 0.5, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public AISSection3Labels: Array<any> = [
        'Subsection 3.1',
        'Subsection 3.2',
        'Subsection 3.3',
        'Subsection 3.4',
        'Subsection 3.5',
        'Subsection 3.6'
    ];
    public AISSection3QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Subsection 3.1', 0, 0, 1],
        ['Subsection 3.2', 0, 1, 0],
        ['Subsection 3.3', 0, 0, 1],
        ['Subsection 3.4', 1, 0, 0],
        ['Subsection 3.5', 1, 0, 0],
        ['Subsection 3.6', 0, 1, 0]
    ];

    /* -------- Subsection 3.1 (Quality data, Subarea label, Total number of error) -------- */
    public AISSubsection31: Array<any> = [
        { data: [1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [0.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public AISSubsection31Labels: Array<any> = ['Sub 3.1 par 1', 'Sub 3.1 par 2', 'Sub 3.1 par 3', 'Sub 3.1 par 4'];
    public AISSubsection31QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.1 par 1', 0, 0, 1],
        ['Sub 3.1 par 2', 0, 0, 0],
        ['Sub 3.1 par 3', 0, 0, 0],
        ['Sub 3.1 par 4', 0, 0, 0]
    ];

    /* -------- Subsection 3.2 (Quality data, Subarea label, Total number of error) -------- */
    public AISSubsection32: Array<any> = [
        { data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public AISSubsection32Labels: Array<any> = ['Sub 3.2 par 1', 'Sub 3.2 par 2', 'Sub 3.2 par 3', 'Sub 3.2 par 4', 'Sub 3.2 par 5', 'Sub 3.2 par 6', 'Sub 3.2 par 7'];
    public AISSubsection32QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.2 par 1', 0, 0, 0],
        ['Sub 3.2 par 2', 0, 0, 0],
        ['Sub 3.2 par 3', 0, 0, 0],
        ['Sub 3.2 par 4', 0, 0, 0],
        ['Sub 3.2 par 5', 0, 1, 0],
        ['Sub 3.2 par 6', 0, 0, 0],
        ['Sub 3.2 par 7', 0, 0, 0]
    ];

    /* -------- Subsection 3.3 (Quality data, Subarea label, Total number of error) -------- */
    public AISSubsection33: Array<any> = [
        { data: [1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 0.5], label: 'Consistency' }
    ];
    public AISSubsection33Labels: Array<any> = ['Sub 3.3 par 1', 'Sub 3.3 par 2'];
    public AISSubsection33QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.3 par 1', 0, 0, 0],
        ['Sub 3.3 par 2', 0, 0, 1]
    ];

    /* -------- Subsection 3.4 (Quality data, Subarea label, Total number of error) -------- */
    public AISSubsection34: Array<any> = [
        { data: [1.0, 0.5], label: 'Unambiguity' },
        { data: [1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0], label: 'Consistency' }
    ];
    public AISSubsection34Labels: Array<any> = ['Sub 3.4 par 1', 'Sub 3.4 par 2'];
    public AISSubsection34QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.4 par 1', 0, 0, 0],
        ['Sub 3.4 par 2', 1, 0, 0]
    ];

    /* -------- Subsection 3.5 (Quality data, Subarea label, Total number of error) -------- */
    public AISSubsection35: Array<any> = [
        { data: [0.5, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0], label: 'Consistency' }
    ];
    public AISSubsection35Labels: Array<any> = ['Sub 3.5 par 1', 'Sub 3.5 par 2'];
    public AISSubsection35QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.5 par 1', 1, 0, 0],
        ['Sub 3.5 par 2', 0, 0, 0]
    ];

    /* -------- Subsection 3.6 (Quality data, Subarea label, Total number of error) -------- */
    public AISSubsection36: Array<any> = [
        { data: [1.0, 1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0, 0.5], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public AISSubsection36Labels: Array<any> = ['Sub 3.6 par 1', 'Sub 3.6 par 2', 'Sub 3.6 par 3', 'Sub 3.6 par 4', 'Sub 3.6 par 5'];
    public AISSubsection36QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.6 par 1', 0, 0, 0],
        ['Sub 3.6 par 2', 0, 0, 0],
        ['Sub 3.6 par 3', 0, 0, 0],
        ['Sub 3.6 par 4', 0, 0, 0],
        ['Sub 3.6 par 5', 0, 1, 0]
    ];

    /* --------------------------------------------------------------------------------
                         Lybrary Information System (LIS) data
       -------------------------------------------------------------------------------- */

    /* -------- Section 3 (Quality data, Subarea label, Total number of error) -------- */
    public LISSection3: Array<any> = [
        { data: [1.0, 1.0, 1.0, 0.7, 1.0, 0.4, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSection3Labels: Array<any> = [
        'Subsection 3.1',
        'Subsection 3.2',
        'Subsection 3.3',
        'Subsection 3.4',
        'Subsection 3.5',
        'Subsection 3.6',
        'Subsection 3.7',
        'Subsection 3.8',
        'Subsection 3.9',
        'Subsection 3.10',
        'Subsection 3.11',
        'Subsection 3.12'
    ];
    public LISSection3QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Subsection 3.1', 0, 0, 0],
        ['Subsection 3.2', 0, 0, 0],
        ['Subsection 3.3', 0, 1, 0],
        ['Subsection 3.4', 1, 0, 1],
        ['Subsection 3.5', 0, 1, 0],
        ['Subsection 3.6', 1, 0, 0],
        ['Subsection 3.7', 0, 0, 0],
        ['Subsection 3.8', 0, 0, 0],
        ['Subsection 3.9', 0, 0, 1],
        ['Subsection 3.10', 0, 0, 0],
        ['Subsection 3.11', 0, 0, 0],
        ['Subsection 3.12', 0, 0, 0]
    ];

    /* -------- Subsection 3.1 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection31: Array<any> = [
        { data: [1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection31Labels: Array<any> = ['Sub 3.1 par 1', 'Sub 3.1 par 2', 'Sub 3.1 par 3'];
    public LISSubsection31QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.1 par 1', 0, 0, 0],
        ['Sub 3.1 par 2', 0, 0, 0],
        ['Sub 3.1 par 3', 0, 0, 0]
    ];

    /* -------- Subsection 3.2 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection32: Array<any> = [
        { data: [1.0], label: 'Unambiguity' },
        { data: [1.0], label: 'Completeness' },
        { data: [1.0], label: 'Consistency' }
    ];
    public LISSubsection32Labels: Array<any> = ['Sub 3.2 par 1'];
    public LISSubsection32QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.2 par 1', 0, 0, 0]
    ];

    /* -------- Subsection 3.3 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection33: Array<any> = [
        { data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0, 0.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection33Labels: Array<any> = ['Sub 3.3 par 1', 'Sub 3.3 par 2', 'Sub 3.3 par 3', 'Sub 3.3 par 4', 'Sub 3.3 par 5', 'Sub 3.3 par 6'];
    public LISSubsection33QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.3 par 1', 0, 0, 0],
        ['Sub 3.3 par 2', 0, 0, 0],
        ['Sub 3.3 par 3', 0, 0, 0],
        ['Sub 3.3 par 4', 0, 0, 0],
        ['Sub 3.3 par 5', 0, 1, 0],
        ['Sub 3.3 par 6', 0, 0, 0]
    ];

    /* -------- Subsection 3.4 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection34: Array<any> = [
        { data: [0.7, 1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [0.5, 1.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection34Labels: Array<any> = ['Sub 3.4 par 1', 'Sub 3.4 par 2', 'Sub 3.4 par 3', 'Sub 3.4 par 4', 'Sub 3.4 par 5'];
    public LISSubsection34QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.4 par 1', 1, 0, 1],
        ['Sub 3.4 par 2', 0, 0, 0],
        ['Sub 3.4 par 3', 0, 0, 0],
        ['Sub 3.4 par 4', 0, 0, 0],
        ['Sub 3.4 par 5', 0, 0, 0]
    ];

    /* -------- Subsection 3.5 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection35: Array<any> = [
        { data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0, 0.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection35Labels: Array<any> = ['Sub 3.5 par 1', 'Sub 3.5 par 2', 'Sub 3.5 par 3', 'Sub 3.5 par 4', 'Sub 3.5 par 5'];
    public LISSubsection35QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.5 par 1', 0, 0, 0],
        ['Sub 3.5 par 2', 0, 0, 0],
        ['Sub 3.5 par 3', 0, 0, 0],
        ['Sub 3.5 par 4', 0, 0, 0],
        ['Sub 3.5 par 5', 0, 1, 0],
        ['Sub 3.5 par 6', 0, 0, 0]
    ];

    /* -------- Subsection 3.6 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection36: Array<any> = [
        { data: [1.0, 1.0, 0.4], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection36Labels: Array<any> = ['Sub 3.6 par 1', 'Sub 3.6 par 2', 'Sub 3.6 par 3'];
    public LISSubsection36QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.6 par 1', 0, 0, 0],
        ['Sub 3.6 par 2', 0, 0, 0],
        ['Sub 3.6 par 3', 1, 0, 0]
    ];

    /* -------- Subsection 3.7 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection37: Array<any> = [
        { data: [1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection37Labels: Array<any> = ['Sub 3.7 par 1', 'Sub 3.7 par 2', 'Sub 3.7 par 3'];
    public LISSubsection37QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.7 par 1', 0, 0, 0],
        ['Sub 3.7 par 2', 0, 0, 0],
        ['Sub 3.7 par 3', 0, 0, 0]
    ];

    /* -------- Subsection 3.8 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection38: Array<any> = [
        { data: [1.0], label: 'Unambiguity' },
        { data: [1.0], label: 'Completeness' },
        { data: [1.0], label: 'Consistency' }
    ];
    public LISSubsection38Labels: Array<any> = ['Sub 3.8 par 1'];
    public LISSubsection38QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['SSub 3.8 par 1', 0, 0, 0]
    ];

    /* -------- Subsection 3.9 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection39: Array<any> = [
        { data: [1.0, 1.0, 1.0, 1.0], label: 'Unambiguity' },
        { data: [1.0, 1.0, 1.0, 1.0], label: 'Completeness' },
        { data: [0.0, 1.0, 1.0, 1.0], label: 'Consistency' }
    ];
    public LISSubsection39Labels: Array<any> = ['Sub 3.9 par 1', 'Sub 3.9 par 2', 'Sub 3.9 par 3', 'Sub 3.9 par 4'];
    public LISSubsection39QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.9 par 1', 0, 0, 1],
        ['Sub 3.9 par 2', 0, 0, 0],
        ['Sub 3.9 par 3', 0, 0, 0],
        ['Sub 3.9 par 4', 0, 0, 0]
    ];

    /* -------- Subsection 3.10 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection310: Array<any> = [
        { data: [1.0], label: 'Unambiguity' },
        { data: [1.0], label: 'Completeness' },
        { data: [1.0], label: 'Consistency' }
    ];
    public LISSubsection310Labels: Array<any> = ['Sub 3.10 par 1'];
    public LISSubsection310QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.10 par 1', 0, 0, 0]
    ];

    /* -------- Subsection 3.11 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection311: Array<any> = [
        { data: [1.0], label: 'Unambiguity' },
        { data: [1.0], label: 'Completeness' },
        { data: [1.0], label: 'Consistency' }
    ];
    public LISSubsection311Labels: Array<any> = ['Sub 3.11 par 1'];
    public LISSubsection311QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.11 par 1', 0, 0, 0]
    ];

    /* -------- Subsection 3.12 (Quality data, Subarea label, Total number of error) -------- */
    public LISSubsection312: Array<any> = [
        { data: [1.0], label: 'Unambiguity' },
        { data: [1.0], label: 'Completeness' },
        { data: [1.0], label: 'Consistency' }
    ];
    public LISSubsection312Labels: Array<any> = ['Sub 3.11 par 1'];
    public LISSubsection312QTable = [
        ['SRS Part', 'Total Ambiguity', 'Total Incompleteness', 'Total Inconsistency'],
        ['Sub 3.11 par 1', 0, 0, 0]
    ];

    /* ----------------------------------------------------------------------------------
                 Getter function for Academic Information System (AIS) data
       ---------------------------------------------------------------------------------- */
    getAISSection3() {
        return this.AISSection3;
    }
    getAISSubsection31(): Array<any> {
        return this.AISSubsection31;
    }
    getAISSubsection32(): Array<any> {
        return this.AISSubsection32;
    }
    getAISSubsection33(): Array<any> {
        return this.AISSubsection33;
    }
    getAISSubsection34(): Array<any> {
        return this.AISSubsection34;
    }
    getAISSubsection35(): Array<any> {
        return this.AISSubsection35;
    }
    getAISSubsection36(): Array<any> {
        return this.AISSubsection36;
    }
    // label getter
    getAISSection3Labels(): Array<any> {
        return this.AISSection3Labels;
    }
    getAISSubsection31Labels(): Array<any> {
        return this.AISSubsection31Labels;
    }
    getAISSubsection32Labels(): Array<any> {
        return this.AISSubsection32Labels;
    }
    getAISSubsection33Labels(): Array<any> {
        return this.AISSubsection33Labels;
    }
    getAISSubsection34Labels(): Array<any> {
        return this.AISSubsection34Labels;
    }
    getAISSubsection35Labels(): Array<any> {
        return this.AISSubsection35Labels;
    }
    getAISSubsection36Labels(): Array<any> {
        return this.AISSubsection36Labels;
    }

    /* ----------------------------------------------------------------------------------
                 Getter function for Library Information System (AIS) data
       ---------------------------------------------------------------------------------- */
    getLISSection3(): Array<any> {
        return this.AISSection3;
    }
    getLISSubsection31(): Array<any> {
        return this.LISSubsection31;
    }
    getLISSubsection32(): Array<any> {
        return this.LISSubsection32;
    }
    getLISSubsection33(): Array<any> {
        return this.LISSubsection33;
    }
    getLISSubsection34(): Array<any> {
        return this.LISSubsection34;
    }
    getLISSubsection35(): Array<any> {
        return this.LISSubsection35;
    }
    getLISSubsection36(): Array<any> {
        return this.LISSubsection36;
    }
    getLISSubsection37(): Array<any> {
        return this.LISSubsection37;
    }
    getLISSubsection38(): Array<any> {
        return this.LISSubsection38;
    }
    getLISSubsection39(): Array<any> {
        return this.LISSubsection39;
    }
    getLISSubsection310(): Array<any> {
        return this.LISSubsection310;
    }
    getLISSubsection311(): Array<any> {
        return this.LISSubsection311;
    }
    getLISSubsection312(): Array<any> {
        return this.LISSubsection312;
    }
    // getter Labels
    getLISSection3Labels(): Array<any> {
        return this.AISSection3Labels;
    }
    getLISSubsection31Labels(): Array<any> {
        return this.LISSubsection31Labels;
    }
    getLISSubsection32Labels(): Array<any> {
        return this.LISSubsection32Labels;
    }
    getLISSubsection33Labels(): Array<any> {
        return this.LISSubsection33Labels;
    }
    getLISSubsection34Labels(): Array<any> {
        return this.LISSubsection34Labels;
    }
    getLISSubsection35Labels(): Array<any> {
        return this.LISSubsection35Labels;
    }
    getLISSubsection36Labels(): Array<any> {
        return this.LISSubsection36Labels;
    }
    getLISSubsection37Labels(): Array<any> {
        return this.LISSubsection37Labels;
    }
    getLISSubsection38Labels(): Array<any> {
        return this.LISSubsection38Labels;
    }
    getLISSubsection39Labels(): Array<any> {
        return this.LISSubsection39Labels;
    }
    getLISSubsection310Labels(): Array<any> {
        return this.LISSubsection310Labels;
    }
    getLISSubsection311Labels(): Array<any> {
        return this.LISSubsection311Labels;
    }
    getLISSubsection312Labels(): Array<any> {
        return this.LISSubsection312Labels;
    }
}