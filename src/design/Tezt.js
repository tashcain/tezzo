import React from 'react';
var __html = require('../asset/saasdesk/index.html');
var template = { __html: __html };


React.module.exports = React.createClass({
    render: function () {
        return (
            <div dangerouslySetInnerHTML={template} />
        );
    }
});