const _elasticSearchUrl = '?';

const _elasticSearch = require('elasticsearch');
const _elasticSearchClient = new _elasticSearch.Client( { host: _elasticSearchUrl } );

const Pusher = require('pusher');

const _pusher = new Pusher({
	appId: '204531',
	key: '479c59972bf192be9acf',
	secret: '19889e3337268d47f4a5',
	encrypted: true
});

const _getData = function( callback )
{
	_elasticSearchClient.search({
		index : 'tweets',
		type :'tweet',
		body : 
		{
			query :
			{
				match_all : {}
			}
		}
	}, callback);
};

const _deleteOldData = function( callback )
{

};

exports.pushUpdate = function()
{
	
	_deleteOldData(function()
	{
		_getData(function( error, result )
		{			
			_pusher.trigger('entities', 'update', { message: "hello world" });
		});		
	});

};
