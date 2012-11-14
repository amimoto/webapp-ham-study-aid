// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerQuestion
// ==========================================================================

BasicExam.ControllerQuestion = M.Controller.extend({

    question_id: '',
    question_text: '',
    question: null,
    answer_detail_text: '',
    answer_list: [],
    answer_correct: null,

    answers_made: [],

    question_list: [],
    question_index: 0,

    footer_text: '',

    question_prep: function(question_id) {
    // --------------------------------------------------
        question = QBank.Q.question_get(question_id);

        this.set(
                  'question_text',
                  question['name']+' - '+question['question']
              );
        answer_list = [];
        for (i=0;i<question['choices'].length;i++) {
            answer_list.push({
                'value': i+1,
                'label': question['choices'][i],
            });
        };
        this.set('answer_list',randomize_array(answer_list));
        this.set('answer_correct',question['answer']);
        this.set('answer_detail_text',question['details']);
        this.set('question',question);
        this.set('question_id',question['id']);
        this.set('footer_text',this.footer_generate());

        toggleview = M.ViewManager.getView(
                                'page_viewquestion',
                                'toggle_actions'
                              );
        toggleview.setView('buttongroup_questioning');

    },

    footer_generate: function() {
    // --------------------------------------------------
        answers_correct = 0;
        answers_made = this.answers_made;
        questions_performed = 0;
        for (i=0;i<answers_made.length;i++) {
            questions_performed++;
            answer = this.answers_made[i];
            if ( answer['ans_correct'] )
                answers_correct++;
        }
        percent = answers_correct ? (100*(answers_correct/questions_performed)).toFixed(1) 
                                  : 0;
        return( "Correct: "+answers_correct+"/" +questions_performed
                            +" ("+percent+"%)"+
              " Remain: "+( this.question_list.length-questions_performed ));
    },

    questions_load: function ( question_ids, question_index ) {
    // --------------------------------------------------
        this.set('question_list',question_ids);
        if ( !question_index ) question_index = 0;
        this.set('question_index',question_index);
        this.set('answers_made',[]);
    },

    init: function(isFirstLoad) {
    // --------------------------------------------------
        this.question_prep(this.question_list[this.question_index]);
        footer_text = this.footer_generate();
        this.set('footer_text',footer_text);
    },

    action_show: function() {
    // --------------------------------------------------
        select = M.ViewManager.getView(
                                'page_viewquestion',
                                'selectionlist_answers'
                              );
        select.setSelection(this.answer_correct);
        toggleview = M.ViewManager.getView(
                                'page_viewquestion',
                                'toggle_actions'
                              );
        toggleview.setView('answer_detail');

    },

    action_submit: function() {
    // --------------------------------------------------
        select = M.ViewManager.getView(
                                'page_viewquestion',
                                'selectionlist_answers'
                              );
        choice = select.getSelection();
        correct_answer = this.answer_correct == choice;

        question_list = this.question_list;

        answer_data = {
            ans_section_id: this.question['section'],
            ans_subsection_id: this.question['subsection'],
            ans_question_id: this.question_id,
            ans_value: choice,
            ans_correct: correct_answer,
            ans_date: new Date(),
        };

        // note that we use createRecord rather than just create
        // (which the docs suggest)
        answer_rec = BasicExam.ModelAnswers.createRecord(
                        answer_data
                      );
        answer_rec.save();

        answers_made = this.answers_made;
        answers_made.push(answer_data);
        this.set('answers_made',answers_made);
        footer_text = this.footer_generate();
        this.set('footer_text',footer_text);

        if ( correct_answer ) {
            this.action_next_question();
        }
        else {
            this.action_show();
        }

    },

    action_prev_question: function () {
    // --------------------------------------------------
        question_index = this.question_index - 1;
        if ( question_index == -1 )
            question_index = this.question_list.length - 1;
        this.set('question_index',question_index);
        question_id = this.question_list[question_index];
        this.question_prep(question_id);

    },

    action_next_question: function () {
    // --------------------------------------------------
        question_index = this.question_index + 1;
        if ( question_index == this.question_list.length )
            question_index = 0;
        this.set('question_index',question_index);
        question_id = this.question_list[question_index];
        this.question_prep(question_id);
    },

});
