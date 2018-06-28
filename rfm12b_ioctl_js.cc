#define IOCTL_ENUM_JS
#include "node_modules/ioctl-enum/ioctl-enum.h"
#include <rfm12b_ioctl.h>
 
IOCTL_ENUM("rfm12b_ioctl");

/*
   Allows you to obtain a structure with statistics about the currently open
   rfm12b board. See the definition of struct rfm12b_stats for details.
   Tracked stats include things like how many bytes and packets have been
   sent and received, how many crc16 checks for received packets failed,
   if the "low battery" status is currently set (probably not all too useful),
   and other driver-internal statistics like rx/tx overflows and underruns.
*/
IOCTL_ENUM_IOCTL("GET_STATS", RFM12B_IOCTL_GET_STATS);

/*
   Get the currently set group identifier for the given board. Only boards
   within the same group can talk to each other.
*/
IOCTL_ENUM_IOCTL("GET_GROUP_ID", RFM12B_IOCTL_GET_GROUP_ID);

/*
   Get the currently set band for the board. The band should match whatever
   your board has been tuned to (check the bottom silkscreen of the rfm12b
   module).
   
   The settings are as follows
      1 ... 433mhz
      2 ... 868mhz
*/
IOCTL_ENUM_IOCTL("GET_BAND_ID", RFM12B_IOCTL_GET_BAND_ID);

/*
   Get the currently set bitrate for the board as a register value. Boards
   must be set to same bitrate in order to communicate with each other. Lower
   bitrates offer greater range and are more error-tolerant.
   
   You can use the macro RFM12B_BIT_RATE_FROM_BYTE to translate this value
   to a bits-per-second value. 
*/
IOCTL_ENUM_IOCTL("GET_BIT_RATE", RFM12B_IOCTL_GET_BIT_RATE);

//IOCTL_ENUM_IOCTL("RATE_FROM_BYTE(b) (10000000/29/((b&0x7f)+1)/(1+(b&0x80)*7))

/*
   Get the currently set Jee ID for the board. If 0, the driver is not
   in Jee-compatible mode (check the doc for RFM12B_DEFAULT_JEE_ID in
   rfm12b_config.h for more info).
*/
IOCTL_ENUM_IOCTL("GET_JEE_ID", RFM12B_IOCTL_GET_JEE_ID);

/*
   Get whether automatic sending of ACK packets in Jee-compatible mode
   is active (also see the docs for RFM12B_DEFAULT_JEE_AUTOACK in
   rfm12b_config.h)
*/
IOCTL_ENUM_IOCTL("GET_JEEMODE_AUTOACK", RFM12B_IOCTL_GET_JEEMODE_AUTOACK);

/*
   Set the group identifier for the given board. Only boards within the
   same group can talk to each other.
*/
IOCTL_ENUM_IOCTL("SET_GROUP_ID", RFM12B_IOCTL_SET_GROUP_ID);

/*
   Set the band for the board. The band should match whatever your board
   has been tuned to (check the bottom of the silkscreen of the rfm12b
   module).
   
   The settings are as follows
      1 ... 433mhz
      2 ... 868mhz
*/
IOCTL_ENUM_IOCTL("SET_BAND_ID", RFM12B_IOCTL_SET_BAND_ID);

/*
   Set the bitrate for the board. Boards must be set to the same bitrate
   to communicate with each other.
   
   Please refer to the datasheet on how to calculate the byte value.
*/
IOCTL_ENUM_IOCTL("SET_BIT_RATE", RFM12B_IOCTL_SET_BIT_RATE);

/*
   Set the Jee ID for the board. If this value is non-zero, then the
   driver is in the Jee-compatible mode. Please check the docs for
   RFM12B_DEFAULT_JEE_ID in rfm12b_config.h for more info on Jee-
   compatible mode.
*/
IOCTL_ENUM_IOCTL("SET_JEE_ID", RFM12B_IOCTL_SET_JEE_ID);

/*
   Enable or disable (1 or 0) the automatic sending for ACK packets
   in Jee-compatible mode. Check the docs for RFM12B_DEFAULT_JEE_AUTOACK
   in rfm12b_config.h for more information.
*/
IOCTL_ENUM_IOCTL("SET_JEEMODE_AUTOACK", RFM12B_IOCTL_SET_JEEMODE_AUTOACK);

/*
  Retrieve information about the device, e.g. its type and its capabilities.
*/
IOCTL_ENUM_IOCTL("GET_MODULE_INFO", RFM12B_IOCTL_GET_MODULE_INFO);

/*
   Structure for driver statistics (see RFM12B_IOCTL_GET_STATS).
   
   All statistics are tracked since the when the device was opened
   by the current user-space process.
*/
/*
typedef struct
{
   unsigned long
      bytes_recvd,         // received bytes count
      bytes_sent,          // sent bytes count
      pkts_recvd,          // received packets count
      pkts_sent,           // sent packets count
      num_recv_overflows,  // FIFO overflow during receiving count
      num_recv_timeouts,   // timeout count during receiving
      num_recv_crc16_fail, // failed crc16 check count during receiving
      num_send_underruns,  // send buffer underrun count
      num_send_timeouts,   // timeout count during sending
      low_battery;         // yes/no if rfm12b Vcc is currently below threshold
   int rssi;               // last rssi reading during receive (rfm69)
} rfm12b_stats;

typedef struct
{
   rfm12_module_type_t module_type;
   struct {
      unsigned has_low_battery:1;
      unsigned has_rssi:1;
   } module_capabilities;
} rfm12b_module_info;

#endif // __RFM12B_IOCTL_H__
*/

IOCTL_ENUM_EXPORT();

