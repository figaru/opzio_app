/**
 * FROM: https://github.com/selectize/selectize.js/pull/437#issuecomment-64765651
 * Calculates and applies the appropriate position of the dropdown.
 * 
 * Supports dropdownDirection up, down and auto. In case menu can't be fitted it's
 * height is limited to don't fall out of display.
 */
positionDropdown = function(selectEl) {
    var $control = selectEl.$control;
    var $dropdown = selectEl.$dropdown;
    var p = getPositions(selectEl);

    // direction
    var direction = getDropdownDirection(p, selectEl);
    if (direction === 'up') {
        $dropdown.addClass('direction-up').removeClass('direction-down');
    } else {
        $dropdown.addClass('direction-down').removeClass('direction-up');
    }
    $control.attr('data-dropdown-direction', direction);

    // position
    var isParentBody = selectEl.settings.dropdownParent === 'body';
    var offset = isParentBody ? $control.offset() : $control.position();
    var fittedHeight;

    switch (direction) {
        case 'up':
            offset.top -= p.dropdown.height;
            if (p.dropdown.height > p.control.above) {
                fittedHeight = p.control.above - 15;
            }
            break;

        case 'down':
            offset.top += p.control.height;
            if (p.dropdown.height > p.control.below) {
                fittedHeight = p.control.below - 15;
            }
            break;
    }

    if (fittedHeight) {
        selectEl.$dropdown_content.css({ 'max-height' : fittedHeight });
    }

    selectEl.$dropdown.css({
        width : $control.outerWidth(),
        top   : offset.top,
        left  : offset.left
    });             
};

/**
    * Gets direction to display dropdown in. Either up or down.
*/
getDropdownDirection = function(positions, selectEl) {
    var direction = selectEl.settings.dropdownDirection;

    if (positions.control.below > positions.dropdown.height) {
        direction = 'down';
    }
    // otherwise direction with most space
    else {
        direction = (positions.control.above > positions.control.below) ? 'up' : 'down';
    }

    return direction;
}

/**
    * Get position information for the control and dropdown element.
*/
getPositions = function(selectEl) {
    var $control = selectEl.$control;
    var $window = $(window);

    var control_height = $control.outerHeight(false);
    var control_above = $control.offset().top - $window.scrollTop();
    var control_below = $window.height() - control_above - control_height;

    var dropdown_height = selectEl.$dropdown.outerHeight(false);

    return {
        control : {
            height : control_height,
            above : control_above,
            below : control_below
        },
        dropdown : {
            height : dropdown_height
        }
    };
};