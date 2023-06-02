import React from 'react'
import { Flex, Button, Image, Text } from '@mantine/core'

const Equipment = ({ caption, id, equipment, updateEquipment }) => <Button
  variant={equipment.includes(id) ? 'light' : 'outline'}
  onClick={() => {
    equipment.includes(id)
      ? updateEquipment(equipment.filter(e => e!== id))
      : updateEquipment([...equipment, id])
  }}
  styles={(theme) => ({
    root: {
      height: 130,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })}>
    <Image
      width={100}
      height={80}
      fit="contain"
      radius="md"
      src={`/equipment/${id}.png`}
      alt={`${caption} Illustration`}
      caption={caption}
    />
</Button>

const BaseConfigure = ({ equipment, updateEquipment }) => {
  return <>
    <Text fs="italic" ta="center" mt={16} mb={8}>
      Select everything you want to use in your workout.
    </Text>
    <Flex
      direction="row"
      gap="sm"
      justify="center"
      wrap="wrap"
    >
      <Equipment caption="Bodyweight" id="none" {...{equipment, updateEquipment}} />
      <Equipment caption="Dumbbell" id="dumbbell" {...{equipment, updateEquipment}} />
      <Equipment caption="Barbell" id="barbell" {...{equipment, updateEquipment}} />
      <Equipment caption="Kettlebell" id="kettlebell" {...{equipment, updateEquipment}} />
      <Equipment caption="Band" id="band" {...{equipment, updateEquipment}} />
      <Equipment caption="Plate" id="plate" {...{equipment, updateEquipment}} />
      <Equipment caption="Pull-up bar" id="pull-up-bar" {...{equipment, updateEquipment}} />
      <Equipment caption="Bench" id="bench" {...{equipment, updateEquipment}} />
    </Flex>
  </>
}

export default BaseConfigure
