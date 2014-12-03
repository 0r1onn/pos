function getBarcodeType( input_barcode )
{
	switch ( input_barcode.length )
	{
		case 10:
			return "common";
		default:
			return "with_count";
	}
}

function addCommonItem( item_list, input_barcode )
{
	if ( !(input_barcode in item_list) )
	{
		item_list[input_barcode] = { number : 0 };
	}
	item_list[input_barcode].number += 1;
}

function addWithCountItem( item_list, input_barcode )
{
	var barcode = input_barcode.substring(0, 10);
	var count = Number( input_barcode.substring(11, input_barcode.length) );
	
	item_list[barcode] = { number : count };
}

function addItemToList( item_list, input_barcode )
{
	switch ( getBarcodeType( input_barcode ) )
	{
		case "common" :
			addCommonItem( item_list, input_barcode );
			break;
		case "with_count" :
			addWithCountItem( item_list, input_barcode );
			break;
	}
}

function calculateItemPromotions( item_list, list_key )
{}
function printItemCountAndPrice( item_list )
{}
function printPromotionsCount( item_list )
{}
function printTotalPrice( item_list )
{}

function countItem( cart_barcode_list )
{
	var item_list = {};
	//item_list的属性为右格式 条形码:{total_count, promotions_count}
	
	for ( index in cart_barcode_list )
	{
		addItemToList( item_list, cart_barcode_list[index] );
	}
	return item_list;
}
function calculatePromotions( item_list )
{
	var item_list_key = Object.keys( item_list );
	for ( index in item_list_key )
	{
		calculateItemPromotions( item_list, item_list_key[index] );
	}
}
function printPriceList( item_list )
{
/*
	var result = '***<没钱赚商店>购物清单***\n' +
            '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
            '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
            '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            '总计：51.00(元)\n' +
            '节省：7.50(元)\n' +
            '**********************';
	console.log(result);
*/
	printItemCountAndPrice( item_list );
	printPromotionsCount( item_list );
	printTotalPrice( item_list );
}

function printInventory( cart_barcode_list )
{
	var item_list;
	
	item_list = countItem( cart_barcode_list );
	calculatePromotions( item_list );
	printPriceList( item_list );
}