
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

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Model: ModelQuestion
// ==========================================================================

BasicExam.ModelQuestion = M.Model.create({

    /* Define the name of your model. Do not delete this property! */
    __name__: 'ModelQuestion',

    /* Sample model properties: */

    firstName: M.Model.attr('String',{
            isRequired:YES
    }),

    lastName: M.Model.attr('String', {
        isRequired:YES
    }),

    zip: M.Model.attr('Integer', {
        isRequired:NO,
        validators: [M.NumberValidator]
    })

}, M.DataProviderLocalStorage);

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerQuestions
// ==========================================================================

BasicExam.ControllerQuestions = M.Controller.extend({

    subsection_id: 0,
    section_id: 0,
    menu_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        question_list = QBank.Q.question_list(
                            this.section_id,
                            this.subsection_id
                        );
        this.set('menu_list',question_list);
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;

        question_ids = [];
        question_index = 0;
        for (i=0;i<this.menu_list.length;i++) {
            question = this.menu_list[i];
            question_ids.push(question['id']);
            if ( question['id'] == menu_rec['id'] ) {
                question_index = i;
            }
        }
        BasicExam.ControllerQuestion.questions_load(
            question_ids,
            question_index
        );
        this.switchToPage('page_viewquestion');
    },

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerStatsSections
// ==========================================================================

BasicExam.ControllerStatsSections = M.Controller.extend({

    section_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        section_list = BasicExam.ModelAnswers.score_breakdown_by_section();
        this.set('section_list',section_list);

        $('.list-menu-entry-bullet-graph').sparkline(
          'html', 
          {
            type: 'bullet',
          }
        );
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
    },

});

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

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerStatsSubSections
// ==========================================================================

BasicExam.ControllerStatsSubSections = M.Controller.extend({

    /* sample controller property */
    myControllerProperty: '',

    /*
    * Sample function
    * To handle the first load of a page.
    */
    init: function(isFirstLoad) {
        if(isFirstLoad) {
            /* do something here, when page is loaded the first time. */
        }
        /* do something, for any other load. */
    },

    /*
    * Example function, which shows how to switch to another page
    * Function is triggered by setting target & action in a view.
    */
    switchToExamplePage: function() {
        /* switch to a page called 'examplePage' */
        this.switchToPage('examplePage');
    }

});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// Controller: ControllerLastQuestionsWrong
// ==========================================================================

BasicExam.ControllerLastQuestionsWrong = M.Controller.extend({

    menu_list: [],

    init: function(isFirstLoad) {
        question_ids = BasicExam.ModelAnswers.last_wrong_answers(50);
        question_list = [];
        for (i=0;i<question_ids.length;i++) {
            question_id = question_ids[i];
            question = QBank.Q.question_lookup[question_id];
            question_list.push(question);
        }
        this.set('menu_list',question_list);
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;

        question_ids = [];
        question_index = 0;
        for (i=0;i<this.menu_list.length;i++) {
            question = this.menu_list[i];
            question_ids.push(question['id']);
            if ( question['id'] == menu_rec['id'] ) {
                question_index = i;
            }
        }
        BasicExam.ControllerQuestion.questions_load(
            question_ids,
            question_index
        );
        this.switchToPage('page_viewquestion');
    },


});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// Controller: ControllerAbout
// ==========================================================================

BasicExam.ControllerAbout = M.Controller.extend({

    menu_list: [
        {
            value: 'https://www.rac.ca/en/amateur-radio/beginner-info/exhaminer/',
            label: 'Question-Set from ExHAMiner by François Daigneault, VE2AAY'
        },
        {
            value: 'http://www.the-m-project.org/',
            label: 'Framework provided by The M Project'
        },
        {
            value: 'http://omnipotent.net/jquery.sparkline/',
            label: 'Graphs provided by jQuery Sparkline'
        },
        {
            value: 'http://rarclub.ca/',
            label: 'Thanks to Richmond Amateur Radio Club for the Beginner\'s course'
        },
        {
            value: 'http://www.disconti.nu/',
            label: 'Put together by Aki Mimoto (amimoto@gmail.com)'
        },
    ],


    init: function(isFirstLoad) {
        this.set('menu_list',this.menu_list);
    },


    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;
        url = menu_rec['value'];
        window.location = url;
    },
});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerSections
// ==========================================================================

BasicExam.ControllerSections = M.Controller.extend({

    menu_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        if ( isFirstLoad ) {
            section_list = QBank.Q.section_list();
            this.set('menu_list',section_list);
        }
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;
        BasicExam.ControllerSubSections.section_id = menu_rec['id'];
        this.switchToPage('page_viewsubsections');
    },

    action_randomize: function () {
    // --------------------------------------------------
        answer_log = BasicExam.ModelAnswers.find();
        question_ids = QBank.Q.randomize_section(null,null,answer_log);
        BasicExam.ControllerQuestion.questions_load(question_ids);
        this.switchToPage('page_viewquestion');

    }


});

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// Controller: ControllerSubSection
// ==========================================================================

BasicExam.ControllerSubSections = M.Controller.extend({

    section_id: 0,
    menu_list: [],

    init: function(isFirstLoad) {
    // --------------------------------------------------
        subsection_list = QBank.Q.subsection_list(this.section_id);
        this.set('menu_list',subsection_list);
    },

    ontap_menu: function (id) {
    // --------------------------------------------------
        var menu_rec = M.ViewManager.getView(id, 'name').item;
        BasicExam.ControllerQuestions.section_id = null;
        BasicExam.ControllerQuestions.subsection_id = menu_rec['id'];
        this.switchToPage('page_viewquestions');
    },

    action_randomize: function () {
    // --------------------------------------------------
        answer_log = BasicExam.ModelAnswers.find();
        question_ids = QBank.Q.randomize_section(this.section_id,null,answer_log);
        BasicExam.ControllerQuestion.questions_load(question_ids);
        this.switchToPage('page_viewquestion');
    }

});

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

// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewSections
// ==========================================================================


BasicExam.ViewSectionsItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= name%> - <%= title%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerSections,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewSections = M.PageView.design({

    events: {
        pageshow: {
            target: BasicExam.ControllerSections,
            action: 'init'
        }
    },
    
    cssClass: 'ViewSections',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Sections',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),


    content: M.ScrollView.design({
        childViews: 'label_sections '+
                    'button_random '+
                    'selectionlist_sections',
        label_sections: M.LabelView.design({
            cssClass: 'label-sections',
            value: 'Select Section to Browse'
        }),

        button_random: M.ButtonView.design({
            value: 'Randomize All Questions',
            events: {
                tap: {
                    target: BasicExam.ControllerSections, 
                    action: 'action_randomize'
                }
            },
        }),

        selectionlist_sections: M.ListView.design({
            listItemTemplateView: BasicExam.ViewSectionsItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerSections,
                property: 'menu_list'
            },
        }),

    }),

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// View: ViewLastLastQuestionsWrongWrong
// ==========================================================================


BasicExam.ViewLastQuestionsWrongItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= name%> - <%= question%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerLastQuestionsWrong,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewLastQuestionsWrong = M.PageView.design({

    events: {
        pageshow: {
            target: BasicExam.ControllerLastQuestionsWrong,
            action: 'init'
        }
    },
    
    cssClass: 'ViewLastQuestionsWrong',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Last 50 Questions Wrong',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_questionss '+
                    'selectionlist_questionss',
        label_questionss: M.LabelView.design({
            cssClass: 'label-questions',
            value: 'Last 50 Wrong Answers',
        }),
        selectionlist_questionss: M.ListView.design({
            listItemTemplateView: BasicExam.ViewLastQuestionsWrongItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerLastQuestionsWrong,
                property: 'menu_list'
            },
        }),
    }),

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
//
// Project: BasicExam
// View: ViewAbout
// ==========================================================================


BasicExam.ViewAboutItem =M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: 'foo',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= label%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerAbout,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewAbout = M.PageView.design({

    events: {
        pagebeforeshow: {
            target: BasicExam.ControllerAbout,
            action: 'init'
        }
    },

    cssClass: 'ViewAbout',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'About',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_about list_menu',
        label_about: M.LabelView.design({
            cssClass: 'label-about',
            value: 'About this Webapp'
        }),

        list_menu: M.ListView.design({
            listItemTemplateView: BasicExam.ViewAboutItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerAbout,
                property: 'menu_list'
            },
        })
    }),

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewHome
// ==========================================================================


BasicExam.ViewHomeItem =M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: 'foo',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= label%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerHome,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewHome = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: BasicExam.ControllerHome,
            action: 'init'
        }
    },
    
    cssClass: 'ViewHome',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'RIC-7 Questions',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
        childViews: 'label list_menu',
        label: M.LabelView.design({
            cssClass: 'label-home',
            value: 'What would you like to do?'
        }),
        list_menu: M.ListView.design({
            listItemTemplateView: BasicExam.ViewHomeItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerHome,
                property: 'menu_list'
            },
        })
    }),

    footer: M.ToolbarView.design({
        value: 'FOOTER',
        anchorLocation: M.BOTTOM
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewSubSections
// ==========================================================================


BasicExam.ViewSubSectionsItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= name%> - <%= title%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerSubSections,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewSubSections = M.PageView.design({

    events: {
        pageshow: {
            target: BasicExam.ControllerSubSections,
            action: 'init'
        }
    },
    
    cssClass: 'ViewSubSections',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Subsections',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_subsections '+
                    'button_random '+
                    'selectionlist_subsections',
        label_subsections: M.LabelView.design({
            cssClass: 'label-subsections',
            value: 'Select Subsection to Browse'
        }),

        button_random: M.ButtonView.design({
            value: 'Randomize Section Questions',
            events: {
                tap: {
                    target: BasicExam.ControllerSubSections, 
                    action: 'action_randomize'
                }
            },
        }),

        selectionlist_subsections: M.ListView.design({
            listItemTemplateView: BasicExam.ViewSubSectionsItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerSubSections,
                property: 'menu_list'
            },
        }),

    }),

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewStatsSubSections
// ==========================================================================

BasicExam.ViewStatsSubSections = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: BasicExam.MyController,
            action: 'init'
        }
    },
    
    cssClass: 'ViewStatsSubSections',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'HEADER',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
        childViews: 'label',
        label: M.LabelView.design({
            value: 'ViewStatsSubSections'
        })
    }),

    footer: M.ToolbarView.design({
        value: 'FOOTER',
        anchorLocation: M.BOTTOM
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewQuestions
// ==========================================================================


BasicExam.ViewQuestionsItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern:   '<div class="list-menu-entry">'
                      +   '<div>'
                      +     '<div class="list-menu-entry-label">'
                      +       '<%= name%> - <%= question%>'
                      +     '</div>'
                      +   '</div>'
                      + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerQuestions,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewQuestions = M.PageView.design({

    events: {
        pageshow: {
            target: BasicExam.ControllerQuestions,
            action: 'init'
        }
    },
    
    cssClass: 'ViewQuestions',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Subsection Questions',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_questionss '+
                    'selectionlist_questionss',
        label_questionss: M.LabelView.design({
            cssClass: 'label-questions',
            value: 'Select Question to View '
        }),
        selectionlist_questionss: M.ListView.design({
            listItemTemplateView: BasicExam.ViewQuestionsItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerQuestions,
                property: 'menu_list'
            },
        }),
    }),

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewQuestion
// ==========================================================================

BasicExam.ViewQuestion = M.PageView.design({

    events: {
        pagebeforeshow: {
            target: BasicExam.ControllerQuestion,
            action: 'init'
        }
    },
    
    cssClass: 'ViewQuestion',

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'Questions',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_question '+
                    'selectionlist_answers '+
                    'toggle_actions',

        label_question: M.LabelView.design({
            cssClass: 'label-question',
            contentBinding: {
                target: BasicExam.ControllerQuestion,
                property: 'question_text'
            },
        }),

        selectionlist_answers: M.SelectionListView.design({
            name: 'answer',
            selectionMode: M.SINGLE_SELECTION,
            contentBinding: {
                target: BasicExam.ControllerQuestion,
                property: 'answer_list'
            },
            computedValue: {
                operation: function(v) {
                    return v;
                },
            },
        }),

        toggle_actions: M.ToggleView.design({

            childViews: 'buttongroup_questioning answer_detail',

            buttongroup_questioning: M.ButtonGroupView.design({
                childViews: 'button_task_save button_task_delete',
                cssClass: 'button-action',
                isSelectable: NO,
                button_task_save: M.ButtonView.design({
                    value: 'Show',
                    events: {
                        tap: {
                            target: BasicExam.ControllerQuestion, 
                            action: 'action_show'
                        }
                    },
                }),
                button_task_delete: M.ButtonView.design({
                    value: 'Submit',
                    events: {
                        tap: {
                            target: BasicExam.ControllerQuestion, 
                            action: 'action_submit'
                        }
                    },
                }),
            }),

            answer_detail: M.ScrollView.design({
                childViews: 'label_answer_detail button_task_next',

                label_answer_detail: M.LabelView.design({
                    cssClass: 'label-answer-detail',
                    contentBinding: {
                        target: BasicExam.ControllerQuestion,
                        property: 'answer_detail_text'
                    },
                }),


                button_task_next: M.ButtonView.design({
                    value: 'Next',
                    events: {
                        tap: {
                            target: BasicExam.ControllerQuestion, 
                            action: 'action_next_question'
                        }
                    },
                }),
            }),

        }),




    }),

    footer: M.ToolbarView.design({
        childViews: 'label',
        anchorLocation: M.BOTTOM,

        label: M.LabelView.design({
            anchorLocation: M.CENTER,
            contentBinding: {
                target: BasicExam.ControllerQuestion,
                property: 'footer_text'
            },
        })
    })

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam
// View: ViewStatsSections
// ==========================================================================

BasicExam.ViewStatsSectionsItem = M.ListItemView.design({
    childViews: 'name',
    isSelectable: NO,
    name: M.LabelView.design({
        name: '',
        valuePattern: '<div class="list-menu-entry">'
                    +   '<div>'
                    +     '<div class="list-menu-entry-label">'
                    +       '<%= section_name%> '
                    +       '<span class="list-menu-entry-bullet-graph" '
                    +              'values="<%= correct%>,<%= seen%>,<%= questions%>" '
                    +              '>'
                    +         'Loading..'
                    +       '</span>'
                    +       ' <%= correct%>/<%= seen%> of <%= questions%> - <%= score%>%'
                    +     '</div>'
                    +   '</div>'
                    + '</div>'
    }),
    events: {
        tap: {
            target: BasicExam.ControllerSubSections,
            action:'ontap_menu'
        }
    },
});


BasicExam.ViewStatsSections = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: BasicExam.ControllerStatsSections, 
            action: 'init'
        }
    },
    
    cssClass: 'ViewStatsSections',

    childViews: 'header content',

    header: M.ToolbarView.design({
        value: 'Subsections',
        anchorLocation: M.TOP,
        showBackButton: true,
    }),

    content: M.ScrollView.design({
        childViews: 'label_statsections '+
                    // 'button_weighted '+
                    'selectionlist_sections',

        label_statsections: M.LabelView.design({
            cssClass: 'label-sections',
            value: 'Select Subsection to Browse'
        }),

        button_weighted: M.ButtonView.design({
            value: 'Randomize Section Questions',
            events: {
                tap: {
                    target: BasicExam.ControllerStatsSections, 
                    action: 'action_randomize'
                }
            },
        }),

        selectionlist_sections: M.ListView.design({
            listItemTemplateView: BasicExam.ViewStatsSectionsItem,
            cssClass: 'list-menu',
            contentBinding: {
                target: BasicExam.ControllerStatsSections,
                property: 'section_list'
            },
        }),

    }),

});


// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: BasicExam 
// ==========================================================================

var BasicExam  = BasicExam || {};

BasicExam.app = M.Application.design({

    entryPage : 'page_viewhome',
    // entryPage : 'page_viewabout',

    page_viewabout: BasicExam.ViewAbout,
    page_viewhome: BasicExam.ViewHome,
    page_viewsections: BasicExam.ViewSections,
    page_viewsubsections: BasicExam.ViewSubSections,
    page_viewquestions: BasicExam.ViewQuestions,
    page_viewquestion: BasicExam.ViewQuestion,

    page_viewlastquestionswrong: BasicExam.ViewLastQuestionsWrong,

    page_viewstatssections: BasicExam.ViewStatsSections,
    page_viewstatssubsections: BasicExam.ViewStatsSubSections,

});
