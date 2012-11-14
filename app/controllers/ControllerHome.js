// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerHome
// ==========================================================================

BasicExam.ControllerHome = M.Controller.extend({

    menu_list: [
        {
            value: 'browse',
            label: 'Browse Sections'
        },
        {
            value: 'exam',
            label: 'Practice Exam'
        },
        {
            value: 'scores',
            label: 'Score Breakdown'
        },
        {
            value: 'whoops',
            label: 'Last 50 Wrong Answers'
        },
        {
            value: 'about',
            label: 'About'
        },

    ],

    init: function(isFirstLoad) {
        this.set('menu_list',this.menu_list);
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;

        action = menu_rec['value'];
        if ( action == 'browse' ) {
            this.switchToPage('page_viewsections');
        }
        else if ( action == 'about' ) {
            this.switchToPage('page_viewabout');
        }
        else if ( action == 'scores' ) {
            this.switchToPage('page_viewstatssections');
        }
        else if ( action == 'whoops' ) {
            this.switchToPage('page_viewlastquestionswrong');
        }
        else {
            answer_log = BasicExam.ModelAnswers.find();
            question_ids = QBank.Q.exam_generate(answer_log);
            BasicExam.ControllerQuestion.questions_load(question_ids);
            this.switchToPage('page_viewquestion');

        }
    },

});
