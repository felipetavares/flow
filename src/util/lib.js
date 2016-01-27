function asKey (addr) {
    return addr.address+addr.port;    
}

module.exports = {
    'asKey': asKey
};
