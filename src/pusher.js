const _elasticSearchUrl = 'elastic:9200';
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
			"aggs": {
				"pusherData": {
					"terms": {
						"field": "entities",
						"size": 25
					},
					"aggs": {
						"avgSentiment": {
							"avg": {
								"field": "sentimentScore"
							}
						}
					}
				}
			},
			"filter" :
			{
				"term" :
				{
					"sentimentScore" : 0
				}
			},
			"size": 0
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
			var pusherData = result.aggregations.pusherData.buckets;
			console.log(pusherData);

			for(var index in pusherData)
			{
				pusherData[index].avgSentiment = pusherData[index].avgSentiment.value;				
				delete pusherData[index].avgSentiment.value;

				pusherData[index].avgSentiment = (pusherData[index].avgSentiment + 5)/10;

				pusherData[index].value = pusherData[index].doc_count;
				delete pusherData[index].doc_count;
			}
			_pusher.trigger( 'entities', 'update', pusherData );
		});		
	});
};
