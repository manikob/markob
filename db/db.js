const conn = require('knex')({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: '',
		database: 'tracker',
		debug: true
	}
});

module.exports.initDB = () => {

	conn.schema.hasTable('client').then((exist) => {
		if (!exist) {
			conn.schema.createTable('client', (t) => {
				t.string('imei', 15).primary().comment('Client device ID');
				t.string('code').comment('User Code/Name');
				t.enu('type', ['tracker', 'receiver']).comment('Client Type: tracker - gps tracker, receiver - data observer');
				t.comment('Client allowed to use this system');
			}).then(() => {
				// default emtpy user
				conn('client').insert({
					imei: '000000000000000',
					code: 'default',
					type: 'receiver'
				}).then(() => {
				});
			});
		}
	});

	conn.schema.hasTable('messages').then((exist) => {
		if (!exist) {
			conn.schema.createTable('messages', (t) => {
				t.increments().primary().comment('Record ID');
				t.timestamp('created_at', true).defaultTo(conn.raw('current_timestamp')).comment('Created time');
				t.string('raw_data').comment('Message body');
				t.string('imei', 15).comment('Device ID');
				t.enu('type', ['inc', 'out']).comment('Message type: inc - incoming, out - outgoing');
				t.index(['created_at', 'imei']);
				t.comment('Stored all messages in original format');
			}).then(() => {
			});
		}
	});
};

module.exports.getUser = (imei) => {
	return conn('client').where({
		imei: imei
	}).select();
};

module.exports.storeIncomingMsg = (ctx, buf) => {
	conn('messages').insert({
		raw_data: buf,
		imei: ctx.getImei(),
		type: 'inc'
	}).then(() => {
	});
};

module.exports.storeOutgoingMsg = (ctx, buf) => {
	conn('messages').insert({
		raw_data: buf,
		imei: ctx.getImei(),
		type: 'out'
	}).then(() => {
	});
};

module.exports.conn = conn;

