import { Box, Heading, VStack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  header?: JSX.Element
  layoutTitle: string
  title: string | JSX.Element
  subTitle?: JSX.Element
} & Rest

const PageContent = ({
  header,
  layoutTitle,
  title,
  subTitle,
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => (
  <Layout title={layoutTitle}>
    <Card p={3} bgImage="url('/img/white-bg.jpg')" bgSize="cover" fontSize="24px">
      <Box
        px="30px"
        py="30px"
        borderWidth={32}
        borderColor="seedclub.green.600"
        sx={{
          borderImage: "url('/img/grid-150x150.jpg')",
          borderImageSlice: "51 51",
          borderImageRepeat: "round",
        }}
      >
        <VStack spacing={10} textAlign="center" {...rest}>
          <VStack spacing={2}>
            {header}
            <Heading as="h1" fontWeight="thin" fontSize="72px">
              {title}
            </Heading>
            {subTitle}
          </VStack>
          {children}
        </VStack>
      </Box>
    </Card>
  </Layout>
)

export default PageContent
