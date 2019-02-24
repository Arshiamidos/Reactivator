const handleSize = 8;
const style = {
	handleSize:handleSize,
	Region: {
		position: 'absolute',
		border: '1px dashed rgba(0,0,0,0.5)',
		outline: '1px dashed rgba(255,255,255,0.5)',
		cursor: 'move'
	},
	RegionLineS:{
		position: 'absolute',
		bottom: 0 ,
		width: '100%',
		height: 2*handleSize,
		zIndex:10002
	},
	RegionLineW:{
		position: 'absolute',
		left: -2*handleSize/2 ,
		top:0,
		width: 2*handleSize,
		height: '90%',
		zIndex:10002

	},
	RegionLineE:{
		position: 'absolute',
		right: 0,
		top:0 ,
		width: 2*handleSize,
		height: '90%',
		zIndex:10002


	},
	RegionLineN:{
		position: 'absolute',
		top: -2*handleSize/2 ,
		width: '100%',
		height: 2*handleSize,
		zIndex:10002

	},

	
	RegionHandleSE: {
		position: 'absolute',
		bottom: -1 * handleSize/2,
		right: -1 * handleSize/2,
		width: 2*handleSize,
		height: 2*handleSize,
		outline: '1px solid rgba(0,0,0,0.5)',
		border: '1px solid rgba(255,255,255,0.5)',
		cursor: 'se-resize',
		zIndex:10002

	},
	RegionHandleSW: {
		position: 'absolute',
		bottom: -1 * handleSize/2,
		left: -1 * handleSize/2,
		width: 2*handleSize,
		height: 2*handleSize,
		outline: '1px solid rgba(0,0,0,0.5)',
		border: '1px solid rgba(255,255,255,0.5)',
		cursor: 'sw-resize',
		zIndex:10002

	},
	RegionHandleNW: {
		position: 'absolute',
		top: -1 * handleSize/2,
		left: -1 * handleSize/2,
		width: 2*handleSize,
		height: 2*handleSize,
		outline: '1px solid rgba(0,0,0,0.5)',
		border: '1px solid rgba(255,255,255,0.5)',
		cursor: 'nw-resize',
		zIndex:10002

	},
	RegionHandleNE: {
		position: 'absolute',
		top: -1 * handleSize/2,
		right: -1 * handleSize/2,
		width: 2*handleSize,
		height: 2*handleSize,
		outline: '1px solid rgba(0,0,0,0.5)',
		border: '1px solid rgba(255,255,255,0.5)',
		cursor: 'ne-resize',
		zIndex:10002

	},
	RegionSelect: {
		position: 'relative',
		display: 'inline-block'		
	}
};

module.exports = style;
