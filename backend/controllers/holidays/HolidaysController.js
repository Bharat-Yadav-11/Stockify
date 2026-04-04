const axios = require('axios');
const Holidays = require('../../models/Holidays');

const MARKET_HOLIDAYS_URL = 'https://www.nseindia.com/api/holiday-master?type=trading';

async function fetchMarketHolidaysFromNse() {
    const response = await axios.get(MARKET_HOLIDAYS_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://www.nseindia.com/',
        },
        timeout: 15000,
    });

    return response.data;
}

async function saveMarketHolidays(holidays) {
    const existing = await Holidays.findOne();

    if (existing) {
        existing.tradingHolidays = holidays;
        await existing.save();
        return existing;
    }

    return Holidays.create({
        tradingHolidays: holidays,
    });
}

module.exports.get_and_save_market_holidays = async (req, res) => {
    try {
        const holidays = await fetchMarketHolidaysFromNse();
        await saveMarketHolidays(holidays);

        return res.status(200).json({
            message: 'Successfully saved',
            tradingHolidays: holidays,
        });
    } catch (err) {
        console.log(err, err.message);
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};

module.exports.get_market_holidays = async (req, res) => {
    try {
        let marketHolidays = await Holidays.findOne();

        if (!marketHolidays || !marketHolidays.tradingHolidays?.CM?.length) {
            const holidays = await fetchMarketHolidaysFromNse();
            marketHolidays = await saveMarketHolidays(holidays);
        }

        return res.status(200).json({
            tradingHolidays: marketHolidays?.tradingHolidays || {},
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error',
            err: err.message,
        });
    }
};
