// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgriTrace {
    enum Status { Created, Packed, InTransit, Arrived, QualityChecked, Sold, Disputed }

    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
        string noteCID;
    }

    struct QualityEvent {
        address inspector;
        uint256 timestamp;
        string reportCID;
        bool passed;
        string notes;
    }

    struct PriceRecord {
        address setter;
        uint256 priceWei;
        uint256 timestamp;
        string noteCID;
    }

    struct Batch {
        string batchId;
        address producer;
        string originGeo;
        uint256 createdAt;
        Status status;
        string productType;
        uint256 quantity;
        string metadataCID;
        Transfer[] transfers;
        QualityEvent[] qualityEvents;
        PriceRecord[] prices;
    }

    mapping(string => Batch) private batches;
    mapping(string => bool) public exists;

    event BatchCreated(string batchId, address producer);
    event TransferRecorded(string batchId, address from, address to);
    event QualityRecorded(string batchId, address inspector, bool passed);
    event PricePosted(string batchId, uint256 priceWei);
    event Sold(string batchId, address buyer, uint256 priceWei);

    modifier onlyProducer(string memory batchId) {
        require(exists[batchId], "Batch doesn't exist");
        require(batches[batchId].producer == msg.sender, "Not producer");
        _;
    }

    function createBatch(
        string calldata batchId,
        string calldata originGeo,
        string calldata productType,
        uint256 quantity,
        string calldata metadataCID
    ) external {
        require(!exists[batchId], "Batch exists");
        Batch storage b = batches[batchId];
        b.batchId = batchId;
        b.producer = msg.sender;
        b.originGeo = originGeo;
        b.productType = productType;
        b.quantity = quantity;
        b.metadataCID = metadataCID;
        b.createdAt = block.timestamp;
        b.status = Status.Created;
        exists[batchId] = true;
        emit BatchCreated(batchId, msg.sender);
    }

    function recordTransfer(string calldata batchId, address to, string calldata noteCID) external {
        require(exists[batchId], "No batch");
        Batch storage b = batches[batchId];
        address currentOwner = (b.transfers.length == 0) ? b.producer : b.transfers[b.transfers.length-1].to;
        require(msg.sender == currentOwner || msg.sender == b.producer, "Not owner");
        b.transfers.push(Transfer({from: msg.sender, to: to, timestamp: block.timestamp, noteCID: noteCID}));
        b.status = Status.InTransit;
        emit TransferRecorded(batchId, msg.sender, to);
    }

    function recordArrival(string calldata batchId) external {
        require(exists[batchId], "No batch");
        Batch storage b = batches[batchId];
        address currentOwner = (b.transfers.length == 0) ? b.producer : b.transfers[b.transfers.length-1].to;
        require(msg.sender == currentOwner, "Not owner");
        b.status = Status.Arrived;
    }

    function postPrice(string calldata batchId, uint256 priceWei, string calldata noteCID) external {
        require(exists[batchId], "No batch");
        Batch storage b = batches[batchId];
        address currentOwner = (b.transfers.length == 0) ? b.producer : b.transfers[b.transfers.length-1].to;
        require(msg.sender == currentOwner, "Not owner");
        b.prices.push(PriceRecord({setter: msg.sender, priceWei: priceWei, timestamp: block.timestamp, noteCID: noteCID}));
        emit PricePosted(batchId, priceWei);
    }

    function acceptPriceAndBuy(string calldata batchId, uint256 priceIndex) external payable {
        require(exists[batchId], "No batch");
        Batch storage b = batches[batchId];
        require(priceIndex < b.prices.length, "bad index");
        PriceRecord memory pr = b.prices[priceIndex];
        require(msg.value == pr.priceWei, "send exact amount");
        payable(pr.setter).transfer(msg.value);
        b.transfers.push(Transfer({from: pr.setter, to: msg.sender, timestamp: block.timestamp, noteCID: ""}));
        b.status = Status.Sold;
        emit Sold(batchId, msg.sender, pr.priceWei);
    }

    function recordQualityEvent(string calldata batchId, bool passed, string calldata reportCID, string calldata notes) external {
        require(exists[batchId], "No batch");
        Batch storage b = batches[batchId];
        b.qualityEvents.push(QualityEvent({inspector: msg.sender, timestamp: block.timestamp, reportCID: reportCID, passed: passed, notes: notes}));
        if(passed) {
            b.status = Status.QualityChecked;
        } else {
            b.status = Status.Disputed;
        }
        emit QualityRecorded(batchId, msg.sender, passed);
    }
}