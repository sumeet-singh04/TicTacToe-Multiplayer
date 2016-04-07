/**
 * Created by Sumeet on 23-Feb-16.
 */

(function () {
    var componentIds = {
        pageHeader: '#nextTurn',
        gameGrid: '#tictactoe',
        modal: '#newOldModal',
        bodyOverlay: '#modalOverlay'
    }

    var pageHandler = window.pageHanlder = {};

    pageHandler.createPage = function () {
        return {
            getModal : function () {
                return document.getElementById(componentIds.modal);
            },
            getOverlay : function () {
                return document.getElementById(componentIds.bodyOverlay);
            },
            getHeader : function() {
                return document.getElementById(pageHeader)
            }
        }

    }


})();