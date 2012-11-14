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

