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
		item_list[input_barcode] = { total_count : 0 , promotions_count : 0 };
	}
	item_list[input_barcode].total_count += 1;
}

function addWithCountItem( item_list, input_barcode )
{
	var barcode = input_barcode.substring(0, 10);
	var count = Number( input_barcode.substring(11, input_barcode.length) );
	
	item_list[barcode] = { total_count : count , promotions_count : 0 };
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

function buyTwoGetOneFreePromotions( item_list, promotions_barcodes_list )
{
	for ( index in promotions_barcodes_list )
	{
		if ( promotions_barcodes_list[index] in item_list )
		{
			item_list[promotions_barcodes_list[index]].promotions_count = parseInt( item_list[promotions_barcodes_list[index]].total_count / 3 );
		}
	}
}

function calculateItemPromotions( item_list, promotions_item )
{
	switch ( promotions_item["type"] )
	{
		case 'BUY_TWO_GET_ONE_FREE':
			buyTwoGetOneFreePromotions( item_list, promotions_item.barcodes );
			break;
	}
}
function printTitle( out_string )
{
	return (out_string += "***<没钱赚商店>购物清单***\n");
}
function printItemCountAndPrice( item_list, out_string )
{
	var cart_barcode = Object.keys( item_list );
	var all_items = loadAllItems();
	
	for ( index in cart_barcode )
	{
		var index_of_items = parseInt(cart_barcode[index].substring(4, 10));
		out_string += "名称：" + all_items[index_of_items].name + "，数量：" + item_list[cart_barcode[index]].total_count + all_items[index_of_items].unit + "，单价：" + all_items[index_of_items].price.toFixed(2) + "(元)，小计：" + (all_items[index_of_items].price * (item_list[cart_barcode[index]].total_count - item_list[cart_barcode[index]].promotions_count)).toFixed(2) + "(元)\n";
	}
	out_string += "----------------------\n";
	return out_string;
}
function printPromotionsCount( item_list, out_string )
{
	var cart_barcode = Object.keys( item_list );
	var all_items = loadAllItems();
	
	out_string += "挥泪赠送商品：\n";
	for ( index in cart_barcode )
	{
		var index_of_items = parseInt(cart_barcode[index].substring(4, 10));
		if ( item_list[cart_barcode[index]].promotions_count )
		{
			out_string += "名称：" + all_items[index_of_items].name + "，数量：" + item_list[cart_barcode[index]].promotions_count + all_items[index_of_items].unit + "\n";
		}
	}
	out_string += "----------------------\n";
	return out_string;
}

function printTotalPrice( item_list, out_string )
{
	var cart_barcode = Object.keys( item_list );
	var all_items = loadAllItems();
	var total_price = 0;
	var promotion_price = 0;
	
	for ( index in cart_barcode )
	{
		var index_of_items = parseInt(cart_barcode[index].substring(4, 10));
		total_price += item_list[cart_barcode[index]].total_count * all_items[index_of_items].price;
		if ( item_list[cart_barcode[index]].promotions_count )
		{
			promotion_price += item_list[cart_barcode[index]].promotions_count * all_items[index_of_items].price;
		}
	}
	total_price -= promotion_price;
	out_string += "总计：" + total_price.toFixed(2) + "(元)\n";
	out_string += "节省：" + promotion_price.toFixed(2) + "(元)\n";
	out_string += "**********************";
	return out_string;
}

/**/
function countItem( cart_barcode_list )
{
	var item_list = {};
	
	for ( index in cart_barcode_list )
	{
		addItemToList( item_list, cart_barcode_list[index] );
	}
	return item_list;
}
function calculatePromotions( item_list )
{
	var promotions = loadPromotions();
	for ( index in promotions )
	{
		calculateItemPromotions( item_list, promotions[index] );
	}
}

function printPriceList( item_list )
{
	var print_string = "";
	
	print_string = printTitle( print_string );
	print_string = printItemCountAndPrice( item_list, print_string );
	print_string = printPromotionsCount( item_list, print_string );
	print_string = printTotalPrice( item_list, print_string );
	
	console.log(print_string);
}
/**/
function printInventory( cart_barcode_list )
{
	var item_list;
	//item_list的属性为右格式 条形码:{total_count, promotions_count}
	
	item_list = countItem( cart_barcode_list );
	calculatePromotions( item_list );
	printPriceList( item_list );
}