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

