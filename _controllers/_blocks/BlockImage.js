/**
 * Image block resided inside a Scenes or timeline
 * @class BlockImage
 * @extends Block
 * @constructor
 * @param {string} i_placement location where objects resides which can be scene or timeline
 * @param {string} i_campaign_timeline_chanel_player_id required and set as block id when block is inserted onto timeline_channel
 * @return {Object} Block instance
 */
define(['jquery', 'backbone', 'Block'], function ($, Backbone, Block) {

    var BlockImage = Block.extend({

        /**
         Constructor
         @method initialize
         **/
        constructor: function (options) {
            Block.prototype.constructor.call(this, options);
            var self = this;
            self.m_blockType = 3130;
            self.m_blockName = BB.JalapenoHelper.getBlockBoilerplate(self.m_blockType).name;
            self.m_blockDescription = undefined;
            self.m_blockIcon = undefined;
            self.m_resourceID = undefined;
            self.m_property.initSubPanel(Elements.BLOCK_IMAGE_COMMON_PROPERTIES);
            self._listenInputChange();
            self._initResourcesData();
        },

        /**
         Set the instance resource data from msdb which includes resource_id (handle of a resource)
         as well as the description of the resource and icon.
         @method _initResourcesData
         **/
        _initResourcesData: function () {
            var self = this;
            var xmlPlayerData = self._getBlockPlayerData();
            var domPlayerData = self._playerDataStringToXmlDom(xmlPlayerData);
            var xSnippet = $(domPlayerData).find('Resource');
            self.m_resourceID = $(xSnippet).attr('hResource');
            self.m_blockDescription = jalapeno.getResourceName(self.m_resourceID);
            var fileFormat = jalapeno.getResourceType(self.m_resourceID);
            self.m_blockIcon = BB.JalapenoHelper.getIcon(fileFormat);
        },

        /**
         Populate the image's common properties panel
         @method _loadBlockSpecificProps
         @return none
         **/
        _loadBlockSpecificProps: function () {
            var self = this;
            self._populate();
            this.m_property.viewSubPanel(Elements.BLOCK_IMAGE_COMMON_PROPERTIES);
        },

        /**
         Update common property title element
         @method _updateTitle override
         @return none
         **/
        _updateTitle: function () {
            var self = this;
            $(Elements.SELECTED_CHANNEL_RESOURCE_NAME).text(self.m_blockDescription);
        },

        /**
         When user changes a URL link for the feed, update the msdb
         @method _listenInputChange
         @return none
         **/
        _listenInputChange: function () {
            var self = this;
            self.m_inputChangeHandler = $(Elements.IMAGE_ASPECT_RATIO).on('change', function () {
                if (!self.m_selected)
                    return;
                var aspectRatio = $(Elements.IMAGE_ASPECT_RATIO + ' option:selected').val() == "on" ? 1 : 0;
                var xmlPlayerData = self._getBlockPlayerData();
                var domPlayerData = self._playerDataStringToXmlDom(xmlPlayerData);
                var xSnippet = $(domPlayerData).find('AspectRatio');
                $(xSnippet).attr('maintain', aspectRatio);
                self._updatePlayerData(domPlayerData);
                // log(xSnippet[0].parentElement.parentElement.parentElement.outerHTML);
            });
        },

        /**
         Load up property values in the common panel
         @method _populate
         @return none
         **/
        _populate: function () {
            var self = this;
            var xmlPlayerData = self._getBlockPlayerData();
            var domPlayerData = self._playerDataStringToXmlDom(xmlPlayerData);
            var xSnippet = $(domPlayerData).find('AspectRatio');
            var aspectRatio = xSnippet.attr('maintain') == '1' ? 'on' : 'off';
            $(Elements.IMAGE_ASPECT_RATIO + ' option[value="' + aspectRatio + '"]').attr("selected", "selected");
        },

        /**
         Get the resource id of the embedded resource
         @method getResourceID
         @return {Number} resource_id;
         **/
        getResourceID: function () {
            var self = this;
            return self.m_resourceID;
        },

        /**
         Delete this block
         @method deleteBlock
         @return none
         **/
        deleteBlock: function () {
            var self = this;
            $(Elements.IMAGE_ASPECT_RATIO).off('change', self.m_aspectRatioHandler);
            self._deleteBlock();
        }
    });

    return BlockImage;
});