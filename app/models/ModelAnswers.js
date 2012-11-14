// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Model: ModelAnswers
// ==========================================================================

BasicExam.ModelAnswers = M.Model.create({

    __name__: 'ModelAnswers',

    ans_id: M.Model.attr('Integer',{ isRequired:YES }),
    ans_section_id: M.Model.attr('Integer',{ isRequired:YES }),
    ans_subsection_id: M.Model.attr('Integer',{ isRequired:YES }),
    ans_question_id: M.Model.attr('Integer',{ isRequired:YES }),
    ans_value: M.Model.attr('Integer',{ isRequired:YES }),
    ans_correct: M.Model.attr('Boolean',{ isRequired:YES }),
    ans_date: M.Model.attr('String',{ isRequired:YES }),
    ans_datetime: M.Model.attr('String',{ isRequired:YES }),

    score_breakdown_by_section: function () {
    // --------------------------------------------------
        answers = this.find();
        answers.sort(function(a,b){
            return a.record.ans_date.localeCompare(
                       b.record.ans_date)
        });
        sl = {}; // sl = subsection lookup

        // Count the questions in each section
        question_lookup = QBank.Q.question_lookup;
        for (id in question_lookup) {
            q = question_lookup[id];
            section_id = q['section'];
            if (!sl[section_id])
                sl[section_id] = { questions: 0, seen: 0, count: 0, correct: 0 }
            sl[section_id]['questions']++;
        }

        // Now count the answers
        seen_questions = {};
        for (i=answers.length-1;i>=0;i--) {
            a = answers[i];
            answer_id = a.record.ans_question_id;
            if ( seen_questions[answer_id] ) continue;
            seen_questions[answer_id] = 1;
            section = a.record.ans_section_id;
            sl[section]['seen']++;
            if (a.record.ans_correct) sl[section]['correct']++;
        }

        // Now the scoring
        section_breakdown = {};
        for (sid in sl) {
            // FIXME: Use a reader instead
            s = QBank.Q.section_lookup[sid];
            sname = s['name'];
            slrec = sl[sid];
            slrec['section'] = s;
            slrec['section_name'] = sname;
            slrec['score'] = slrec['seen']>0 ? (100*slrec['correct']/slrec['seen']).toFixed(1)
                                             : 0;
            slrec['completed'] = (100*slrec['seen']/slrec['questions']).toFixed(1);
            section_breakdown[sname] = slrec;
        }

        return section_breakdown;
    },


    score_breakdown_by_subsection: function () {
    // --------------------------------------------------
        answers = this.find();
        sl = {}; // sl = subsection lookup
        for (i=0;i<answers.length;i++) {
            a = answers[i];
            subsection = a.record.ans_subsection_id;
            if (!sl[subsection])
                sl[subsection] = { correct: 0, seen: 0 }
            sl[subsection]['seen']++;
            if (a.record.ans_correct) sl[subsection]['correct']++;
        }

        // Now the scoring
        subsection_breakdown = {};
        for (ssid in sl) {
            // FIXME: Use a reader instead
            ss = QBank.Q.subsection_lookup[ssid];
            ssname = ss['name'];
            slrec = sl[ssid];
            slrec['subsection'] = ss;
            slrec['score'] = slrec['seen']>0 ? (100*slrec['correct']/slrec['seen']).toFixed(1)
                                             : '-';

            subsection_breakdown[ssname] = slrec;
        }

        return subsection_breakdown;
    },


    last_wrong_answers: function (count) {
    // --------------------------------------------------
        if ( count == null ) count = 50;
        answers = this.find();
        answers.sort(function(a,b){
            return b.record.ans_date.localeCompare(
                       a.record.ans_date)
        });

        question_ids = [];
        seen_questions = {};
        for (i=0;i<answers.length;i++) {
            a = answers[i];
            question_id = a.record.ans_question_id;
            if ( seen_questions[question_id] ) continue;
            seen_questions[question_id] = 1;
            if ( a.record.ans_correct ) {
              continue;
            };
            question_ids.push(question_id);
            if ( question_ids.length >= 50 ) break;
        }

        return question_ids;
    },

}, M.DataProviderLocalStorage);
