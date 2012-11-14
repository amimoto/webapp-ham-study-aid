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

