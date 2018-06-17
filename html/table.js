$(document).ready(function() {

    //SIMULATE DATA -------------------------------------------------------------------
    var columns = [];
    var rows = [];
    var nbColumn = 5;
    var nbRows = 50;

    // DATA COLUMNS
    for (var i = 0; i < nbColumn; i++) {
        var column = {
            name: 'Column ' + (i + 1),
            id: i + 1
        }
        columns.push(column);
    };

    // DATA ROWS
    for (var i = 0; i < nbRows; i++) {
        var cells = []
        for (var j = 0; j < nbColumn; j++) {
            var cell = {
                name: '[Row ' + (i + 1) + '| Col ' + (j + 1) + ']',
                id: j + 1
            }
            cells.push(cell);
        };
        var row = {
            position: i + 1,
            cells: cells
        }
        rows.push(row);
    };

    var buildTable = function(leftTable, rightTable, columns, rows, cells) {
        for (let index = 0; index < array.length; index++) {
            const element = array[index];

        }
    };

    var buildColumns = function(columns, tables) {
        var thead = '<thead>';
        $.each(columns, function(key, value) {
            var th = '<th class="column-sortable" data-column="' + value.id + '"><span>' + value.name + '</span><div data-id="' + value.id + '" class="resize-border"</div></th>';
            thead = thead.concat(th);
        });
        thead = thead.concat('</thead>');
        $('#left-table thead').append(thead);
    };

    var buildRows = function(rows, table) {
        var tbody = '';
        $.each(rows, function(key, value) {
            var tr = '<tr data-position="' + value.position + '">';
            $.each(value.cells, function(key, value) {
                var td = '<td data-column="' + value.id + '">' + value.name + '</td>';
                tr = tr.concat(td);
            });
            tr = tr.concat('</tr>');
            tbody = tbody.concat(tr);
        });
        $('#' + table + ' tbody').append(tbody);
    };

    buildRows(rows, 'left-table');
    buildRows(rows, 'right-table');
    buildColumns(columns);
    //------------------------------------------------------------------

    //HOVER TD
    $('td').on('mouseover', function(e) {
        var $td = $(e.target);
        var $table = $(e.target).closest('table');
        var $tbody = $(e.target).closest('tbody');
        var position = $(e.target).parent().attr('data-position');
        var column = $(e.target).attr('data-column');
        var trOpposite = $('#' + $tbody.attr('data-opposite-side') + '-table tr[data-position=' + position + ']');
        var $th = $('#' + $table.attr('id') + ' thead th[data-column=' + column + ']');
        trOpposite.find('td').each(function(i, e) {
            var $e = $(e);
            $e.addClass('simulateHover');
        });
        $th.addClass('simulateHover');
    });
    $('td').on('mouseleave', function(e) {
        var $tbody = $(e.target).closest('tbody');
        var position = $(e.target).parent().attr('data-position');
        var column = $(e.target).attr('data-column');
        var $table = $(e.target).closest('table');
        var trOpposite = $('#' + $tbody.attr('data-opposite-side') + '-table tr[data-position=' + position + ']');
        var $th = $('#' + $table.attr('id') + ' thead th[data-column=' + column + ']');
        trOpposite.find('td').each(function(i, e) {
            var $e = $(e);
            $e.removeClass('simulateHover');
        });
        $th.removeClass('simulateHover');
    });
    //------------------------------------------------------------------


    // BUILD VERTICAL SCROLL
    var rowCount = 20;
    $('#left-table tr').each(function(e) {
        rowCount += $(this).height();
    });
    $('#scrollbar').css({ 'height': rowCount });

    // SYNCHRONISATION SCROLLBAR
    var eventTriggerer;

    var scrollTableFunction = function(event) {
        if (eventTriggerer && eventTriggerer !== "scroll-table") {
            eventTriggerer = "";
            return false;
        }
        var oppositeSide = $(event.target).attr("data-opposite-side");
        eventTriggerer = "scroll-table";
        $('#' + oppositeSide + '-table tbody').off('scroll');
        $('#scroll-container').scrollTop($(this).scrollTop());
        $('#' + oppositeSide + '-table tbody').scrollTop($(this).scrollTop());
    };


    $('#left-table tbody').on('scroll', scrollTableFunction);
    $('#right-table tbody').on('scroll', scrollTableFunction);

    $('#left-table tbody').on('mouseenter', function(e) {
        $('#left-table tbody').on('scroll', scrollTableFunction);
        $('#right-table tbody').off('scroll');
    });

    $('#right-table tbody').on('mouseenter', function(e) {
        $('#right-table tbody').on('scroll', scrollTableFunction);
        $('#left-table tbody').off('scroll');
    });

    $('#scroll-container').on('scroll', function(e) {
        if (eventTriggerer && eventTriggerer !== "scrollbar") {
            eventTriggerer = "";
            return false;
        }
        eventTriggerer = "scrollbar";

        $('#left-table tbody').off('scroll');
        $('#left-table tbody').scrollTop($(this).scrollTop());
        $('#left-table tbody').on('scroll', scrollTableFunction);

        $('#right-table tbody').off('scroll');
        $('#right-table tbody').scrollTop($(this).scrollTop());
        $('#right-table tbody').on('scroll', scrollTableFunction);
    });

    // COLUMN SORTABLE
    $('.column-sortable').on('mouseenter', function(e) {
        var $target = $(e.target).is('span') || $(e.target).is('div') ? $(e.target).parent() : $(e.target);
        $target.addClass('sortable');
    });
    $('.column-sortable').on('mouseleave', function(e) {
        var $target = $(e.target).is('span') || $(e.target).is('div') ? $(e.target).parent() : $(e.target);
        $target.removeClass('sortable');
    });



    // SORTABLE
    var idSortable = -1;
    var trOpposite;
    $("table tbody").sortable({
        start: function(e, ui) {
            var target = $(ui.item[0]);
            idSortable = target.attr('data-position');
            trOpposite = $('#' + $(e.target).attr('data-opposite-side') + '-table tr[data-position=' + idSortable + ']');
        },
        update: function(e, ui) {
            var $nextElement = $('#' + $(e.target).attr('data-opposite-side') + '-table tr[data-position=' + $(ui.item[0].nextElementSibling).attr('data-position') + ']');
            trOpposite.insertBefore($nextElement);
            $(this).children().each(function(index) {
                $(this).find('td').last().html(index + 1)
            });
        }
    });

    // RESIZABLE
    var headers = {};
    var mouseStart = -1;
    var mouseEnd = -1;
    var id = -1;
    $('.resize-border').closest('th').each(function(i, e) {
        var $e = $(e);
        var $resizeBar = $e.find('.resize-border');
        var id = parseInt($resizeBar.attr('data-id'), 10);
        headers[id] = {
            width: 250
        };
        $e.closest('table').find('tr td:nth-child(' + ($e.index() + 1) + ')').css({
            'width': headers[id].width + 'px',
            'max-width': headers[id].width + 'px',
            'min-width': headers[id].width + 'px'
        });
        headers[1] = {
            width: 251
        };
        headers[6] = {
            width: 251
        };
        $e.css({
            'width': headers[id].width + 'px',
            'max-width': headers[id].width + 'px',
            'min-width': headers[id].width + 'px'
        });

        $resizeBar.height($e.height());
    });

    $('.resize-border').draggable({
        start: function(e) {
            var target = $(e.target);
            id = target.attr('data-id');
            mouseStart = $(this).offset().left;
            $('.resize-vertical-bar').show();
        },

        drag: function(e) {
            $('.resize-vertical-bar').css('left', $(this).offset().left);
        },

        stop: function(e) {
            mouseEnd = $(this).offset().left;
            var diff = mouseEnd - mouseStart;
            headers[id].width = headers[id].width + diff;
            headers[id].width = headers[id].width < 100 ? 100 : headers[id].width;
            var $target = $(e.target);
            $target.closest('th').css({
                'width': headers[id].width + 'px',
                'max-width': headers[id].width + 'px',
                'min-width': headers[id].width + 'px'
            });
            $target.closest('table').find('tr td:nth-child(' + ($target.closest('th').index() + 1) + ')').css({
                'width': headers[id].width + 'px',
                'max-width': headers[id].width + 'px',
                'min-width': headers[id].width + 'px'
            });
            // reinit vars
            $('.resize-vertical-bar').hide();
            $target.css('left', '0');
            $target.css('top', '0');
        }
    })
});