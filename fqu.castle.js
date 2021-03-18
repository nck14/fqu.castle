
let input_room = [];
input_room[0] = [11, 6, 11, 6, 3, 10, 6];
input_room[1] = [7, 9, 6, 13, 5, 15, 5];
input_room[2] = [1, 10, 12, 7, 13, 7, 5];
input_room[3] = [13, 11, 10, 8, 10, 12, 13];

let scanned_room = [];
scanned_room[0] = [-1, -1, -1, -1, -1, -1, -1];
scanned_room[1] = [-1, -1, -1, -1, -1, -1, -1];
scanned_room[2] = [-1, -1, -1, -1, -1, -1, -1];
scanned_room[3] = [-1, -1, -1, -1, -1, -1, -1];

let scanned_room_count = [];

let wall = {top: [], left: []};
wall.top[0] = [-1, -1, -1, -1, -1, -1, -1];
wall.top[1] = [-1, -1, -1, -1, -1, -1, -1];
wall.top[2] = [-1, -1, -1, -1, -1, -1, -1];
wall.top[3] = [-1, -1, -1, -1, -1, -1, -1];

wall.left[0] = [-1, -1, -1, -1];
wall.left[1] = [-1, -1, -1, -1];
wall.left[2] = [-1, -1, -1, -1];
wall.left[3] = [-1, -1, -1, -1];
wall.left[4] = [-1, -1, -1, -1];
wall.left[5] = [-1, -1, -1, -1];

// 서북동남
let cardinal = {
	dong: 4,
	seo: 1,
	nam: 8,
	buk: 2
}

let room_num = 0;

const checkRoom = function(input_room, __y, __x)
{
	let _direct = input_room[__y][__x];
	let searched = [];

	if((_direct & cardinal.dong) == 0)
	{
		searched.push(cardinal.dong);
	}

	if((_direct & cardinal.seo) == 0)
	{
		searched.push(cardinal.seo);
	}
	else if(__x > 0)
	{
		wall.left[__x-1][__y] = 0;
	}

	if((_direct & cardinal.nam) == 0)
	{
		searched.push(cardinal.nam);
	}

	if((_direct & cardinal.buk) == 0)
	{
		searched.push(cardinal.buk);
	}
	else if(__y > 0)
	{
		wall.top[__y-1][__x] = 0;
	}
	
	return searched;
}

const scannedRoom = function(y, x)
{
	scanned_room[y][x] = room_num;
}

const roomScanner = function(_sy, _sx, prevDirect)
{
	// 스캔
	scannedRoom(_sy, _sx);

	let room_direct = checkRoom(input_room, _sy, _sx);
	
	// 전 들렸던 방 삭제
	if(prevDirect)
	{
		const idx = room_direct.indexOf(prevDirect);
		if(idx > -1) room_direct.splice(idx, 1);
	}

	// 가야하는 방향
	if(room_direct.length > 0)
	{
		let room_direct_searched;

		for(let direct in room_direct)
		{
			// console.log(room_direct[direct]);

			if(room_direct[direct] == cardinal.dong)
			{
				roomScanner(_sy, _sx+1, cardinal.seo);
				continue;
			}

			if(room_direct[direct] == cardinal.seo)
			{
				roomScanner(_sy, _sx-1, cardinal.dong);
				continue;
			}

			if(room_direct[direct] == cardinal.nam)
			{
				roomScanner(_sy+1, _sx, cardinal.buk);
				continue;
			}

			if(room_direct[direct] == cardinal.buk)
			{
				roomScanner(_sy-1, _sx, cardinal.nam);
				continue;
			}
		}
	}
}

const main = function()
{
	let _ry, _rx;

	for(_ry = 0; _ry < scanned_room.length; _ry++)
	{
		for(_rx = 0; _rx < scanned_room[_ry].length; _rx++)
		{
			// scan start _ry, _rx
			if(scanned_room[_ry][_rx] == -1)
			{
				scanned_room_count[room_num] = 1;
				roomScanner(_ry, _rx);
				room_num += 1;
			}
			else
			{
				scanned_room_count[scanned_room[_ry][_rx]] += 1;
			}
		}
	}

	console.log('성 방의 갯수:', room_num);
	console.log('각 성의 방 갯수:', scanned_room_count);
	// console.log(scanned_room);

	let y, x;
	let max_scanned_room_count = 0;

	// 상하 비교
	for(y = 0; y < wall.top.length; y++)
	{
		for(x = 0; x < wall.top[y].length; x++)
		{
			if(wall.top[y][x] != -1)
			{
				if(scanned_room[y][x] == scanned_room[y+1][x]) continue;

				// console.log(y, x, '룸번호:', scanned_room[y][x], '룸수', scanned_room_count[scanned_room[y][x]]);
				// console.log('-', y+1, x, '룸번호:', scanned_room[y+1][x], '룸수', scanned_room_count[scanned_room[y+1][x]]);

				max_scanned_room_count = Math.max(scanned_room_count[scanned_room[y][x]] + scanned_room_count[scanned_room[y+1][x]], max_scanned_room_count);
			}
		}
	}

	// 좌우비교
	for(x = 0; x < wall.left.length; x++)
	{
		for(y = 0; y < wall.left[y].length; y++)
		{
			if(wall.left[x][y] != -1)
			{
				if(scanned_room[y][x] == scanned_room[y][x+1]) continue;

				max_scanned_room_count = Math.max(scanned_room_count[scanned_room[y][x]] + scanned_room_count[scanned_room[y][x+1]], max_scanned_room_count);
			}
		}
	}

	// console.log(wall);
	console.log('벽 제거 후 넓은 방', max_scanned_room_count);
}

main();
