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

