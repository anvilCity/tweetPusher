const _elasticSearchUrl = '?';
const _timePeriod = 10; // minutes


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
	var dateThreshold = new Date();

	dateThreshold.setMinutes( dateThreshold.getMinutes() - _timePeriod );

	_elasticSearchClient.delete({
		index : 'tweets',
		type :'tweet',
		body : 
		{
			query :
			{
				range :
				{
					dateSaved :
					{
						lte : dateThreshold.getTime()
					}
				}
			}
		}
	}, callback);
};

exports.pushUpdate = function()
{
	_deleteOldData(function()
	{
		_getData(function( error, result )
		{			
			// TODO: process and return result

			_pusher.trigger('entities', 'update', { message: "hello world" });
		});		
	});
};
